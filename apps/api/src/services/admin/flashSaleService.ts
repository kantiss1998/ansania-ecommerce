import {
  FlashSale,
  FlashSaleProduct,
  Product,
  ProductVariant,
} from "@repo/database";
import { NotFoundError } from "@repo/shared/errors";
import { calculatePagination } from "@repo/shared/utils";
import { Op } from "sequelize";

export interface FlashSaleListResult {
  items: FlashSale[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function listFlashSales(query: {
  page?: number | string;
  limit?: number | string;
  search?: string;
  status?: string;
}): Promise<FlashSaleListResult> {
  const { page = 1, limit = 10, search, status } = query;
  const offset = (Number(page) - 1) * Number(limit);
  const where: Record<string, unknown> = {};

  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }

  if (status === "active") {
    where.is_active = true;
    where.end_date = { [Op.gt]: new Date() };
  } else if (status === "expired") {
    where.end_date = { [Op.lt]: new Date() };
  }

  const { count, rows } = await FlashSale.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [["start_date", "DESC"]],
  });

  const pagination = calculatePagination(Number(page), Number(limit), count);

  return {
    items: rows,
    meta: pagination,
  };
}

export async function getFlashSaleDetail(id: number): Promise<FlashSale> {
  const flashSale = await FlashSale.findByPk(id, {
    include: [
      {
        model: FlashSaleProduct,
        as: "products",
        include: [
          { model: Product, as: "product", attributes: ["name", "slug"] },
          { model: ProductVariant, as: "variant" },
        ],
      },
    ],
  });

  if (!flashSale) throw new NotFoundError("FlashSale");
  return flashSale;
}

export async function createFlashSale(
  data: Partial<FlashSale>,
): Promise<FlashSale> {
  return FlashSale.create(data as unknown as FlashSale);
}

export async function updateFlashSale(
  id: number,
  data: Partial<FlashSale>,
): Promise<FlashSale> {
  const flashSale = await FlashSale.findByPk(id);
  if (!flashSale) throw new NotFoundError("FlashSale");

  await flashSale.update(data);
  return flashSale;
}

export async function deleteFlashSale(
  id: number,
): Promise<{ success: boolean }> {
  const flashSale = await FlashSale.findByPk(id);
  if (!flashSale) throw new NotFoundError("FlashSale");

  await flashSale.destroy();
  return { success: true };
}

export async function toggleFlashSaleActive(id: number): Promise<FlashSale> {
  const flashSale = await FlashSale.findByPk(id);
  if (!flashSale) throw new NotFoundError("FlashSale");
  await flashSale.update({ is_active: !flashSale.is_active });
  return flashSale;
}

export async function getFlashSaleProducts(
  id: number,
): Promise<FlashSaleProduct[]> {
  return FlashSaleProduct.findAll({
    where: { flash_sale_id: id },
    include: [
      { model: Product, as: "product", attributes: ["name", "slug"] },
      { model: ProductVariant, as: "variant" },
    ],
  });
}

export async function updateFlashSaleProduct(
  id: number,
  data: Partial<FlashSaleProduct>,
): Promise<FlashSaleProduct> {
  const flashSaleProduct = await FlashSaleProduct.findByPk(id);
  if (!flashSaleProduct) throw new NotFoundError("FlashSaleProduct");
  await flashSaleProduct.update(data);
  return flashSaleProduct;
}

export async function addProductsToFlashSale(
  flashSaleId: number,
  products: Partial<FlashSaleProduct>[],
): Promise<FlashSaleProduct[]> {
  const flashSale = await FlashSale.findByPk(flashSaleId);
  if (!flashSale) throw new NotFoundError("FlashSale");

  const flashSaleProducts = products.map((p) => ({
    ...p,
    flash_sale_id: flashSaleId,
  }));

  return FlashSaleProduct.bulkCreate(
    flashSaleProducts as unknown as FlashSaleProduct[],
  );
}

export async function removeProductFromFlashSale(
  id: number,
): Promise<{ success: boolean }> {
  const flashSaleProduct = await FlashSaleProduct.findByPk(id);
  if (!flashSaleProduct) throw new NotFoundError("FlashSaleProduct");

  await flashSaleProduct.destroy();
  return { success: true };
}
