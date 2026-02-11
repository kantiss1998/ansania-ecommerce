
import {
    Product,
    ProductVariant,
    Category,
    ProductStock,
    FilterColor,
    FilterSize,
    FilterFinishing
} from '@repo/database';
import { slugify } from '@repo/shared/utils';
import { ServiceUnavailableError, InternalServerError } from '@repo/shared/errors';
import { ODOO_CONFIG } from '@repo/shared/constants';

import { odooClient } from './odoo.client';

export class OdooProductService {
    async safeSearchRead(model: string, domain: any[] = [], fields: string[] = [], options: any = {}) {
        const result = await odooClient.searchRead(model, domain, fields, options);
        return Array.isArray(result) ? result : [];
    }

    // Main sync function
    async syncProducts() {
        try {
            console.log("🚀 Starting product sync from Odoo...");
            const startTime = Date.now();

            // Step 1: Get valid warehouse for stock syncing
            const warehouse = await this.getValidWarehouse();
            const warehouseId = warehouse?.id;
            console.log(`🏭 Syncing stock for Warehouse: ${warehouse?.name || 'Default'} (ID: ${warehouseId})`);

            // Step 2: Get products with "internal" category filter
            const products = await this.getFilteredProducts();

            // Step 3: Get variants for these products (with warehouse context)
            const variants = await this.getProductVariants(products, warehouseId);

            // Step 4: Get attribute values for variant mapping
            const attributeValues = await this.getAttributeValues();

            // Step 5: Process and save to local database
            const syncResult = await this.processAndSaveProducts(
                products,
                variants,
                attributeValues,
                warehouseId
            );

            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;

            console.log(`✅ Product sync completed in ${duration}s`);

            return {
                success: true,
                message: "Product sync completed successfully",
                data: {
                    ...syncResult,
                    duration: `${duration}s`,
                    syncTime: new Date(),
                },
            };
        } catch (error) {
            console.error("❌ Product sync failed:", error instanceof Error ? error.message : String(error));
            throw new ServiceUnavailableError('Odoo Product Sync');
        }
    }

    async syncCategories() {
        try {
            console.log("📂 Starting category sync from Odoo...");
            const categories = await this.safeSearchRead(
                "product.category",
                [],
                ["id", "name", "parent_id"]
            );

            let createdCount = 0;
            let updatedCount = 0;

            // First pass: upsert names and basic data
            for (const cat of categories) {
                let category = await Category.findOne({ where: { odoo_id: cat.id } });

                if (category) {
                    await category.update({
                        name: cat.name,
                        slug: slugify(cat.name),
                        synced_at: new Date()
                    });
                    updatedCount++;
                } else {
                    category = await Category.create({
                        odoo_id: cat.id,
                        name: cat.name,
                        slug: slugify(cat.name),
                        is_active: true,
                        synced_at: new Date()
                    });
                    createdCount++;
                }
            }

            // Second pass: update parent_id
            for (const cat of categories) {
                if (Array.isArray(cat.parent_id)) {
                    const odooParentId = cat.parent_id[0];
                    const parent = await Category.findOne({ where: { odoo_id: odooParentId } });

                    if (parent) {
                        await Category.update(
                            { parent_id: parent.id },
                            { where: { odoo_id: cat.id } }
                        );
                    }
                }
            }

            return {
                success: true,
                created: createdCount,
                updated: updatedCount,
                total: categories.length
            };
        } catch (error) {
            console.error("❌ Category sync failed:", error);
            throw error;
        }
    }

    async getFilteredProducts() {
        try {
            console.log("📦 Fetching 'INTERNAL' categories from Odoo...");

            // 1. Find categories with "INTERNAL" in the name
            const categories = await this.safeSearchRead(
                "product.category",
                [["name", "ilike", "INTERNAL"]],
                ["id", "name"]
            );

            if (!categories || categories.length === 0) {
                console.warn("⚠️ No category named 'INTERNAL' found in Odoo.");
                return [];
            }

            const categoryIds = categories.map(c => c.id);
            console.log(`📂 Found ${categories.length} Internal categories: ${categories.map(c => c.name).join(', ')}`);

            // 2. Fetch products belonging to these categories
            const products = await this.safeSearchRead(
                "product.template",
                [
                    ["categ_id", "in", categoryIds],
                    ["active", "=", true]
                ],
                [
                    "id",
                    "name",
                    "description",
                    "categ_id",
                    "list_price",
                    "image_1920",
                    "active",
                    "product_variant_ids",
                    "weight",
                    "default_code"
                ]
            );

            console.log(`✅ Found ${products.length} products in INTERNAL categories`);
            return products;
        } catch (error) {
            console.error("❌ Failed to get filtered products:", error);
            throw error;
        }
    }

    // Get variants for the filtered products
    async getProductVariants(products: any[], warehouseId?: number) {
        try {
            console.log("🔄 Fetching product variants...");

            const productIds = products.map((p) => p.id);
            const context = warehouseId ? { warehouse_id: warehouseId } : {};

            // Fetch in chunks to avoid URL too long errors if many products
            const chunkSize = ODOO_CONFIG.CHUNK_SIZE;
            let allVariants: any[] = [];

            for (let i = 0; i < productIds.length; i += chunkSize) {
                const chunk = productIds.slice(i, i + chunkSize);
                const variants = await this.safeSearchRead(
                    "product.product",
                    [["product_tmpl_id", "in", chunk]],
                    [
                        "id",
                        "product_tmpl_id",
                        "display_name",
                        "default_code",
                        "image_1920",
                        "active",
                        "product_template_attribute_value_ids",
                        "lst_price", // Variant price might be different
                        "qty_available" // Stock
                    ],
                    { context }
                );
                allVariants = allVariants.concat(variants);
            }

            console.log(`✅ Found ${allVariants.length} product variants`);
            return allVariants;
        } catch (error) {
            console.error("❌ Failed to get product variants:", error instanceof Error ? error.message : String(error));
            throw new ServiceUnavailableError('Odoo Product Variants');
        }
    }

    // Get attribute values for variant names and hex codes
    async getAttributeValues() {
        try {
            console.log("🎨 Fetching attribute values from Odoo...");

            // Get template attribute values (Large limit to ensure we get all)
            const templateAttrValues = await this.safeSearchRead(
                "product.template.attribute.value",
                [],
                [
                    "id",
                    "product_tmpl_id",
                    "attribute_id",
                    "product_attribute_value_id",
                    "html_color",
                ],
                { limit: 10000 }
            );

            // Get attribute values details
            const attributeValues = await this.safeSearchRead(
                "product.attribute.value",
                [],
                ["id", "name", "attribute_id", "html_color"],
                { limit: 10000 }
            );

            // Get attributes for names
            const attributes = await this.safeSearchRead(
                "product.attribute",
                [],
                ["id", "name"],
                { limit: 1000 }
            );

            console.log(`✅ Loaded ${templateAttrValues.length} template values, ${attributeValues.length} attribute values, ${attributes.length} attributes`);

            return {
                templateAttrValues,
                attributeValues,
                attributes,
            };
        } catch (error) {
            console.error("❌ Failed to get attribute values:", error instanceof Error ? error.message : String(error));
            throw new ServiceUnavailableError('Odoo Attributes');
        }
    }

    async getValidWarehouse() {
        try {
            console.log("🏭 Fetching 'GUDANG ONLINE'...");
            const warehouses = await this.safeSearchRead(
                "stock.warehouse",
                [["name", "=", "GUDANG ONLINE"]],
                ["id", "name", "code"],
                { limit: 1 }
            );

            if (warehouses && warehouses.length > 0) {
                console.log(`✅ Found Warehouse: ${warehouses[0].name} (ID: ${warehouses[0].id})`);
                return warehouses[0];
            } else {
                console.error("❌ CRITICAL: 'GUDANG ONLINE' warehouse not found in Odoo.");
                return null;
            }
        } catch (error) {
            console.error("❌ Failed to fetch warehouse:", error);
            return null;
        }
    }

    // Process and save products to local database
    async processAndSaveProducts(
        products: any[],
        variants: any[],
        attributeData: any,
        warehouseId?: number
    ) {
        try {
            console.log("💾 Processing and saving products to local database...");

            let processedProducts = 0;
            let processedVariants = 0;
            const errors: string[] = [];

            // Sets to collect unique attributes for Filter tables
            const collectedColors = new Map<string, string | null>(); // Name -> Hex
            const collectedSizes = new Set<string>();
            const collectedFinishings = new Set<string>();

            for (const odooProduct of products) {
                try {
                    // Handle Category
                    let categoryId: number;
                    let odooCategoryName: string;

                    if (odooProduct.categ_id && Array.isArray(odooProduct.categ_id) && odooProduct.categ_id.length > 1) {
                        odooCategoryName = odooProduct.categ_id[1];
                        const [category] = await Category.findOrCreate({
                            where: { odoo_id: odooProduct.categ_id[0] },
                            defaults: {
                                name: odooCategoryName,
                                slug: slugify(odooCategoryName),
                                odoo_id: odooProduct.categ_id[0]
                            } as any,
                        });
                        categoryId = category.id;
                    } else {
                        const [category] = await Category.findOrCreate({
                            where: { name: 'Uncategorized' },
                            defaults: {
                                name: 'Uncategorized',
                                slug: 'uncategorized',
                                odoo_id: 0
                            } as any,
                        });
                        categoryId = category.id;
                    }

                    // Prepare product data for local DB
                    const productData = {
                        odoo_id: odooProduct.id,
                        name: odooProduct.name,
                        slug: slugify(odooProduct.name + '-' + odooProduct.id),
                        description: odooProduct.description || null,
                        category_id: categoryId,
                        sku: odooProduct.default_code || null,
                        weight: odooProduct.weight || null,
                        is_active: odooProduct.active || false,
                        synced_at: new Date(),
                    };

                    // Create or update product
                    const [localProduct, created] = await Product.findOrCreate({
                        where: { odoo_id: odooProduct.id },
                        defaults: {
                            ...productData,
                            selling_price: odooProduct.list_price || 0,
                            compare_price: 0
                        } as any,
                    });

                    if (!created) {
                        // Update basic info but EXCLUDE selling_price and compare_price for manual control
                        await localProduct.update(productData as any);
                    }

                    processedProducts++;

                    // Process variants
                    const productVariants = variants.filter(
                        (v) => v.product_tmpl_id[0] === odooProduct.id,
                    );

                    for (const odooVariant of productVariants) {
                        try {
                            const variantInfo = this.processVariantAttributes(odooVariant, attributeData);

                            const variantData = {
                                product_id: localProduct.id,
                                odoo_product_id: odooVariant.id,
                                sku: odooVariant.default_code || `VAR - ${odooVariant.id}`,
                                price: odooVariant.lst_price ?? 0,
                                stock: odooVariant.qty_available || 0,
                                is_visible: odooVariant.active || false,
                                color: variantInfo.attributes.color || null,
                                size: variantInfo.attributes.size || null,
                                finishing: variantInfo.attributes.finishing || null,
                                synced_at: new Date(),
                            };

                            const [localVariant, variantCreated] = await ProductVariant.findOrCreate({
                                where: { odoo_product_id: odooVariant.id },
                                defaults: variantData as any,
                            });

                            if (!variantCreated) {
                                await localVariant.update(variantData as any);
                            }

                            // Update ProductStock
                            const [stockEntry, stockEntryCreated] = await ProductStock.findOrCreate({
                                where: { product_variant_id: localVariant.id },
                                defaults: {
                                    product_variant_id: localVariant.id,
                                    quantity: odooVariant.qty_available || 0,
                                    reserved_quantity: 0,
                                    available_quantity: odooVariant.qty_available || 0,
                                    odoo_warehouse_id: warehouseId || null,
                                    last_synced_at: new Date()
                                } as any
                            });

                            if (!stockEntryCreated) {
                                stockEntry.quantity = odooVariant.qty_available || 0;
                                if (warehouseId) stockEntry.odoo_warehouse_id = warehouseId;
                                stockEntry.last_synced_at = new Date();
                                await stockEntry.save();
                            }

                            processedVariants++;

                            // Collect attributes for Filter Sync
                            if (variantInfo.attributes.color) {
                                collectedColors.set(variantInfo.attributes.color, variantInfo.hexCode || null);
                            }
                            if (variantInfo.attributes.size) {
                                collectedSizes.add(variantInfo.attributes.size);
                            }
                            if (variantInfo.attributes.finishing) {
                                collectedFinishings.add(variantInfo.attributes.finishing);
                            }
                        } catch (vErr) {
                            errors.push(`Variant ${odooVariant.id}: ${vErr instanceof Error ? vErr.message : String(vErr)}`);
                        }
                    }
                } catch (pErr) {
                    errors.push(`Product ${odooProduct.id}: ${pErr instanceof Error ? pErr.message : String(pErr)}`);
                }
            }

            console.log(`📊 Collected for Filter Sync: ${collectedColors.size} colors, ${collectedSizes.size} sizes, ${collectedFinishings.size} finishings`);
            await this.syncFilterAttributes(collectedColors, collectedSizes, collectedFinishings);

            console.log(`✅ Processed ${processedProducts} products and ${processedVariants} variants`);

            return {
                processedProducts,
                processedVariants,
                totalErrors: errors.length,
                errors: errors.slice(0, 10),
            };
        } catch (error) {
            console.error("❌ Failed to process and save products:", error);
            throw error;
        }
    }

    // Process variant attributes to get variant name, value, and hex code
    processVariantAttributes(variant: any, attributeData: any) {
        const { templateAttrValues, attributeValues, attributes } = attributeData;

        const variantInfo: any = {
            variantName: variant.display_name,
            variantValue: "",
            hexCode: null,
            attributes: {
                color: null,
                size: null,
                finishing: null
            }
        };

        if (variant.product_template_attribute_value_ids && variant.product_template_attribute_value_ids.length > 0) {
            const attrValueIds = variant.product_template_attribute_value_ids;
            const variantAttrValues = templateAttrValues.filter((tav: any) => attrValueIds.includes(tav.id));
            const variantValueNames = [];

            for (const tav of variantAttrValues) {
                const attrValue = attributeValues.find((av: any) => av.id === tav.product_attribute_value_id[0]);
                if (attrValue) {
                    variantValueNames.push(attrValue.name);
                    let attrName = "";
                    if (tav.attribute_id && Array.isArray(tav.attribute_id)) {
                        attrName = tav.attribute_id[1].toLowerCase();
                    } else {
                        const attrDef = attributes.find((a: any) => a.id === (Array.isArray(tav.attribute_id) ? tav.attribute_id[0] : tav.attribute_id));
                        if (attrDef) attrName = attrDef.name.toLowerCase();
                    }

                    // Debug log to console to see what Odoo provides
                    console.log(`🔍 Mapping Attribute: "${attrName}" Value: "${attrValue.name}"`);

                    if (attrName) {
                        if (attrName.includes('color') || attrName.includes('warna')) {
                            variantInfo.attributes.color = attrValue.name;
                        } else if (attrName.includes('size') || attrName.includes('ukuran')) {
                            variantInfo.attributes.size = attrValue.name;
                        } else if (attrName.includes('finish') || attrName.includes('finishing') || attrName.includes('bahan')) {
                            variantInfo.attributes.finishing = attrValue.name;
                        }
                    }

                    if (attrValue.html_color && !variantInfo.hexCode) variantInfo.hexCode = attrValue.html_color;
                    if (tav.html_color && !variantInfo.hexCode) variantInfo.hexCode = tav.html_color;
                }
            }
            if (variantValueNames.length > 0) variantInfo.variantValue = variantValueNames.join(", ");
        }
        return variantInfo;
    }

    // Process image URL (convert base64 to URL or handle as needed)
    processImageUrl(imageData: string) {
        // If imageData is base64, you might want to:
        // 1. Save it as file and return file URL
        // 2. Upload to cloud storage and return URL
        // 3. Keep as base64 data URL

        // For now, return as data URL
        if (imageData) {
            return `data:image/jpeg;base64,${imageData}`;
        }
        return null;
    }

    // Get sync status
    async getSyncStatus(): Promise<{ success: boolean; data: { totalProducts: number; totalVariants: number; lastSync: Date | null; }; }> {
        try {
            const productCount = await Product.count();
            const variantCount = await ProductVariant.count();

            // Get last sync time
            const lastProduct = await Product.findOne({
                order: [["updated_at", "DESC"]],
            });

            return {
                success: true,
                data: {
                    totalProducts: productCount,
                    totalVariants: variantCount,
                    lastSync: lastProduct ? lastProduct.updated_at : null,
                },
            };
        } catch (error) {
            console.error("❌ Failed to get sync status:", error instanceof Error ? error.message : String(error));
            throw new InternalServerError(`Failed to get sync status: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Test connection to Odoo
    async testConnection() {
        try {
            console.log("🔗 Testing Odoo connection for product sync...");

            // Try to fetch one product to test connection
            const testProducts = await this.safeSearchRead(
                "product.template",
                [],
                ["id", "name"],
                { limit: 1 },
            );

            if (testProducts && testProducts.length > 0) {
                console.log("✅ Odoo product sync connection test successful");
                return true;
            } else {
                console.log("⚠️ Odoo connection works but no products found");
                return true;
            }
        } catch (error) {
            console.error(
                "❌ Odoo product sync connection test failed:",
                error instanceof Error ? error.message : String(error),
            );
            return false;
        }
    }

    // Get single product by Odoo ID
    async getProductByOdooId(odooProductId: number) {
        try {
            console.log(`📖 Getting Odoo product with ID: ${odooProductId}`);

            const products = await this.safeSearchRead(
                "product.template",
                [["id", "=", odooProductId]],
                [
                    "id",
                    "name",
                    "description",
                    "categ_id",
                    "list_price",
                    "image_1920",
                    "active",
                ],
            );

            if (!products || products.length === 0) {
                console.log(`⚠️ Product with ID ${odooProductId} not found`);
                return null;
            }

            console.log(`✅ Found Odoo product: ${products[0].name}`);
            return products[0];
        } catch (error) {
            console.error("❌ Failed to get Odoo product:", error instanceof Error ? error.message : String(error));
            throw new ServiceUnavailableError('Odoo Product');
        }
    }

    // Original syncStock method for compatibility if called elsewhere, adjusted to use new pattern if needed
    // or just kept as utility. The controller calls syncStock.
    async syncStock() {
        console.log('[ODOO_SYNC] Starting Stock Sync (Legacy Support)...');
        try {
            const warehouse = await this.getValidWarehouse();
            const warehouseId = warehouse?.id;
            const context = warehouseId ? { warehouse_id: warehouseId } : {};
            console.log(`[ODOO_SYNC] Syncing stock for Warehouse: ${warehouse?.name || 'Default'} (ID: ${warehouseId})`);

            // Get all variants with Odoo IDs
            const variants = await ProductVariant.findAll({
                where: {
                    odoo_product_id: { [require('sequelize').Op.ne]: null }
                }
            });

            console.log(`[ODOO_SYNC] Found ${variants.length} variants to sync stock`);

            // Batch fetch stock from Odoo
            const odooIds = variants.map(v => v.odoo_product_id);
            const chunkSize = ODOO_CONFIG.CHUNK_SIZE;
            let syncedCount = 0;

            for (let i = 0; i < odooIds.length; i += chunkSize) {
                const chunk = odooIds.slice(i, i + chunkSize);

                try {
                    const stockData = await this.safeSearchRead(
                        'product.product',
                        [['id', 'in', chunk]],
                        ['id', 'qty_available'],
                        { context }
                    );

                    const stockMap = new Map(stockData.map((item: any) => [item.id, item.qty_available]));

                    for (const variant of variants) {
                        if (stockMap.has(variant.odoo_product_id)) {
                            const newQty = stockMap.get(variant.odoo_product_id) as number;

                            // Update Variant Cache
                            await variant.update({
                                stock: newQty,
                                synced_at: new Date()
                            } as any);

                            // Update ProductStock Table (Safe update)
                            const [stockEnt, stockEntCreated] = await ProductStock.findOrCreate({
                                where: { product_variant_id: variant.id },
                                defaults: {
                                    product_variant_id: variant.id,
                                    quantity: newQty,
                                    reserved_quantity: 0,
                                    available_quantity: newQty,
                                    odoo_warehouse_id: warehouseId || null,
                                    last_synced_at: new Date()
                                } as any
                            });
                            if (!stockEntCreated) {
                                stockEnt.quantity = newQty;
                                if (warehouseId) stockEnt.odoo_warehouse_id = warehouseId;
                                stockEnt.last_synced_at = new Date();
                                await stockEnt.save();
                            }

                            syncedCount++;
                        }
                    }
                    console.log(`[ODOO_SYNC] Synced stock for chunk ${i} - ${i + chunk.length}`);
                } catch (chunkError) {
                    console.error(`[ODOO_SYNC] ❌ Failed to sync stock for chunk ${i} - ${i + chunk.length}: `, chunkError);
                }
            }

            return { updated: variants.length };
        } catch (error) {
            console.error('[ODOO_SYNC] Stock sync failed:', error);
            throw error;
        }
    }

    async syncFilterAttributes(
        colors: Map<string, string | null>,
        sizes: Set<string>,
        finishings: Set<string>
    ) {
        try {
            console.log(`🎨 Syncing Filter Attributes: ${colors.size} colors, ${sizes.size} sizes, ${finishings.size} finishings`);

            // Sync Colors
            for (const [name, hex] of colors.entries()) {
                console.log(`  - Syncing Color: "${name}" (${hex || 'no hex'})`);
                await FilterColor.findOrCreate({
                    where: { name },
                    defaults: {
                        name,
                        hex_code: hex || '#000000',
                        display_order: 0,
                        is_active: true
                    } as any
                });
            }

            // Sync Sizes
            for (const name of sizes) {
                console.log(`  - Syncing Size: "${name}"`);
                await FilterSize.findOrCreate({
                    where: { name },
                    defaults: {
                        name,
                        display_order: 0,
                        is_active: true
                    } as any
                });
            }

            // Sync Finishings
            for (const name of finishings) {
                console.log(`  - Syncing Finishing: "${name}"`);
                await FilterFinishing.findOrCreate({
                    where: { name },
                    defaults: {
                        name,
                        display_order: 0,
                        is_active: true
                    } as any
                });
            }
            console.log('✅ Filter Attributes sync process completed.');

        } catch (error) {
            console.error('❌ Failed to sync filter attributes:', error);
        }
    }
}
