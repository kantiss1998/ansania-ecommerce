
import { User } from '@repo/database';
import { RegisterDTO, LoginDTO } from '@repo/shared/schemas';

import { odooClient } from './odoo.client';

export class OdooCustomerService {
    /**
     * Authenticate user against Odoo (mock/placeholder for now)
     */
    async authenticate(credentials: LoginDTO) {
        console.log('Verifying Odoo user:', credentials.email);
        // TODO: Implement actual Odoo auth check if needed
        // For now returning mock success to match previous behavior
        return {
            uid: 123,
            partner_id: 456,
            name: 'John Doe',
            email: credentials.email,
        };
    }

    /**
     * Create customer in Odoo from registration data
     */
    async createCustomer(data: RegisterDTO) {
        console.log('Creating Odoo customer:', data.email);

        if (odooClient.isMockMode()) {
            return {
                uid: Math.floor(Math.random() * 10000),
                partner_id: Math.floor(Math.random() * 10000),
            };
        }

        try {
            // Create partner in Odoo
            const partnerData = {
                name: data.full_name,
                email: data.email,
                phone: data.phone || '',
                customer_rank: 1,
                is_company: false,
                comment: `Registered via e-commerce`
            };

            const partnerId = await odooClient.create('res.partner', partnerData);

            // Should we also create a 'res.users' record? 
            // Previous code returned uid and partner_id.
            // For now, let's assume we just need partner_id for syncing.
            // But authService expects 'uid' property in return.

            return {
                uid: partnerId, // Using partner_id as uid for now if user creation is complex
                partner_id: partnerId
            };
        } catch (error) {
            console.error('Failed to create Odoo customer:', error);
            throw error;
        }
    }

    /**
     * Sync customer to Odoo on registration
     */
    async syncCustomer(userId: number): Promise<number> {
        console.log(`[ODOO_SYNC] Syncing customer to Odoo: User ID ${userId}`);

        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error(`User not found: ${userId}`);
            }

            if (user.odoo_partner_id) {
                console.log(`[ODOO_SYNC] User ${user.email} already has Odoo Partner ID: ${user.odoo_partner_id}`);
                return user.odoo_partner_id;
            }

            if (odooClient.isMockMode()) {
                const mockOdooId = Math.floor(Math.random() * 100000);
                await user.update({ odoo_partner_id: mockOdooId });
                console.log(`[ODOO_SYNC] Mock partner created with ID: ${mockOdooId}`);
                return mockOdooId;
            }

            // Create partner in Odoo
            const partnerData = {
                name: user.full_name,
                email: user.email,
                phone: user.phone || '',
                customer_rank: 1,
                is_company: false,
                comment: `Registered via e-commerce on ${user.created_at.toISOString()}`
            };

            const odooPartnerId = await odooClient.create('res.partner', partnerData);
            await user.update({ odoo_partner_id: odooPartnerId });

            console.log(`[ODOO_SYNC] Customer synced to Odoo - Partner ID: ${odooPartnerId}`);
            return odooPartnerId;

        } catch (error) {
            console.error('[ODOO_SYNC] Failed to sync customer:', error);
            throw error;
        }
    }

    /**
     * Update customer profile in Odoo when user updates their info
     */
    async updateCustomer(userId: number): Promise<void> {
        console.log(`[ODOO_SYNC] Updating customer in Odoo: User ID ${userId}`);

        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error(`User not found: ${userId}`);
            }

            if (!user.odoo_partner_id) {
                console.warn(`[ODOO_SYNC] User ${user.email} not synced to Odoo yet, creating new partner`);
                await this.syncCustomer(userId);
                return;
            }

            if (odooClient.isMockMode()) {
                console.log(`[ODOO_SYNC] Mock mode - would update Odoo partner ${user.odoo_partner_id}`);
                return;
            }

            // Update partner in Odoo
            const updateData = {
                name: user.full_name,
                email: user.email,
                phone: user.phone || '',
            };

            await odooClient.write('res.partner', [user.odoo_partner_id], updateData);

            console.log(`[ODOO_SYNC] Customer updated in Odoo - Partner ID: ${user.odoo_partner_id}`);

        } catch (error) {
            console.error('[ODOO_SYNC] Failed to update customer in Odoo:', error);
            // Don't throw - profile update should succeed locally even if Odoo sync fails
        }
    }

    /**
     * Sync customers from Odoo to Local DB
     * - Fetches 'res.partner' from Odoo
     * - Updates/Creates 'User' in local DB
     * - Updates/Creates 'Address' in local DB
     */
    async syncCustomersFromOdoo(limit = 50) {
        console.log("🚀 Starting Customer Sync from Odoo...");
        const startTime = Date.now();
        let syncedCount = 0;
        let errorsCount = 0;

        try {
            // Step 1: Fetch Customers from Odoo
            // Filter: Customers (customer_rank > 0) OR having an email
            // We want to avoid syncing vendors if possible, but strict filtering depends on Odoo usage.
            // For now, let's focus on records with emails to avoid creating users without login ID.
            const domain = [['email', '!=', false]];
            const fields = [
                'id', 'name', 'email', 'phone', 'mobile',
                'street', 'street2', 'city', 'zip', 'state_id', 'country_id',
                'type', 'parent_id', 'child_ids'
            ];

            const partners = await odooClient.searchRead('res.partner', domain, fields, { limit });
            console.log(`📦 Found ${partners.length} partners in Odoo (Limit: ${limit})`);

            for (const partner of partners) {
                try {
                    await this.processPartner(partner);
                    syncedCount++;
                } catch (err) {
                    console.error(`❌ Error syncing partner ${partner.name} (${partner.id}):`, err);
                    errorsCount++;
                }
            }

        } catch (error) {
            console.error("❌ Fatal error in syncCustomersFromOdoo:", error);
            throw error;
        }

        const duration = (Date.now() - startTime) / 1000;
        console.log(`✅ Customer Sync Completed in ${duration}s. Synced: ${syncedCount}, Errors: ${errorsCount}`);
        return { synced: syncedCount, errors: errorsCount };
    }

    private async processPartner(partner: any) {
        if (!partner.email) return; // Skip if no email (cannot be a user)

        // 1. Find or Create User
        // Check by Odoo ID first, then Email
        let user = await User.findOne({
            where: { odoo_partner_id: partner.id }
        });

        if (!user) {
            user = await User.findOne({
                where: { email: partner.email }
            });
        }

        const userData = {
            email: partner.email,
            full_name: partner.name,
            phone: partner.mobile || partner.phone,
            odoo_partner_id: partner.id,
            email_verified: true, // Auto-verify if from Odoo
            // If creating new user, we need a password.
            // But we can't sync password from Odoo.
            // Strategy: If new, set a random placeholder or leave handling to auth system (if nullable).
            // User model says password is NOT NULL.
            // We'll set a default placeholder if creating.
        };

        if (user) {
            // Update existing
            await user.update({
                full_name: userData.full_name,
                phone: userData.phone,
                odoo_partner_id: userData.odoo_partner_id
                // Don't overwrite email easily if different? trust Odoo for now.
            });
        } else {
            // Create new
            user = await User.create({
                ...userData,
                password: '$2a$10$PlaceholderHashForOdooSyncedUserButIdeallyShouldBeReset',
                role: 'customer'
            });
            console.log(`👤 Created new user: ${user.email}`);
        }

        // 2. Sync Address (Main Partner Address)
        // If the partner itself has address info, save it as a default address
        await this.syncAddress(user.id, partner, true);

        // 3. Sync Child Addresses (Delivery, Invoice, etc)
        // Note: 'searchRead' with 'child_ids' only gives IDs. We might need to fetch them if we want full details.
        // For optimization, we can fetch child addresses in a separate batch if needed.
        // But simpler: just use key address fields from the main partner for now.
        // If 'child_ids' are important, Odoo Client usually requires fetching them separately.
    }

    private async syncAddress(userId: number, partnerData: any, isDefault: boolean) {
        // Basic address check
        if (!partnerData.street && !partnerData.city) return;

        // Map Odoo fields to Local Schema
        const addressData = {
            user_id: userId,
            recipient_name: partnerData.name,
            phone: partnerData.mobile || partnerData.phone || '',
            address_line1: partnerData.street || '',
            address_line2: partnerData.street2 || '',
            city: partnerData.city || '',
            postal_code: partnerData.zip || '',
            province: partnerData.state_id ? partnerData.state_id[1] : '', // Odoo Many2one [id, name]
            country: partnerData.country_id ? partnerData.country_id[1] : 'Indonesia',
            is_default: isDefault,
            label: partnerData.type || 'Home'
        };

        // Check if this address already exists (by Odoo ID logic? we don't store odoo_address_id on Address model explicitly in standard schema, 
        // wait, Schema.md said: odoo_address_id INT UNIQUE.
        // Let's check Address.ts.
        // Address.ts does NOT have odoo_address_id.
        // So we have to rely on content matching or just creating new ones?
        // To avoid duplicates, we can check if an address with same content exists for this user.

        // Actually, let's verify if Address.ts has odoo_address_id.
        // I checked Address.ts earlier, it did NOT have odoo_address_id defined in the class or init.
        // Just standard fields.
        // So I will implement a "find similar" check.

        const existingAddress = await import('@repo/database').then(m => m.Address.findOne({
            where: {
                user_id: userId,
                address_line1: addressData.address_line1,
                city: addressData.city,
                postal_code: addressData.postal_code
            }
        }));

        if (existingAddress) {
            await existingAddress.update(addressData);
        } else {
            // Dynamic import to avoid circular dependency if that was the reason? 
            // Or just a hack. Assuming Address is exported from @repo/database
            const { Address } = await import('@repo/database');
            await Address.create(addressData as any); // Keeping as any for now if type defs are loose, but ideally should be typed.
        }
    }
}
