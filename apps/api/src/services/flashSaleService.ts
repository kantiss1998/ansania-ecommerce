import {
  FlashSale,
  FlashSaleProduct,
  Product,
  ProductImage,
} from "@repo/database";
import { Op, WhereOptions } from "sequelize";

export async function getActiveFlashSales() {
  const now = new Date();
  const flashSales = await FlashSale.findAll({
    where: {
      is_active: true,
      start_date: { [Op.lte]: now },
      end_date: { [Op.gte]: now },
    } as WhereOptions,
    include: [
      {
        model: FlashSaleProduct,
        as: "products",
        include: [
          {
            model: Product,
            as: "product",
            include: [{ model: ProductImage, as: "images" }],
          },
        ],

        order: [["display_order", "ASC"]],
      },
    ],
    order: [["start_date", "ASC"]],
  });

  return flashSales;
}

export async function getFlashSale(id: number) {
  const flashSale = await FlashSale.findOne({
    where: {
      id,
      is_active: true,
    },
    include: [
      {
        model: FlashSaleProduct,
        as: "products",
        include: [
          {
            model: Product,
            as: "product",
            include: [{ model: ProductImage, as: "images" }],
          },
        ],

        order: [["display_order", "ASC"]],
      },
    ],
  });

  return flashSale;
}
export async function getFlashSaleProducts(flashSaleId: number) {
  const products = await FlashSaleProduct.findAll({
    where: { flash_sale_id: flashSaleId },
    include: [
      {
        model: Product,
        as: "product",
        include: [{ model: ProductImage, as: "images" }],
      },
    ],
    order: [["display_order", "ASC"]],
  });

  return products;
}
