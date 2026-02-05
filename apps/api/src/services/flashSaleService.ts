
import { FlashSale, FlashSaleProduct, Product, ProductImage } from '@repo/database';
import { Op } from 'sequelize';

export async function getActiveFlashSales() {
    const now = new Date();
    const flashSales = await FlashSale.findAll({
        where: {
            is_active: true,
            start_time: { [Op.lte]: now },
            end_time: { [Op.gte]: now }
        },
        include: [
            {
                model: FlashSaleProduct,
                as: 'products',
                include: [
                    {
                        model: Product,
                        as: 'product',
                        include: [{ model: ProductImage, as: 'images' }]
                    }
                ],
                order: [['display_order', 'ASC']]
            }
        ],
        order: [['start_time', 'ASC']]
    } as any);

    return flashSales;
}

export async function getFlashSale(id: number) {
    const flashSale = await FlashSale.findOne({
        where: {
            id,
            is_active: true
        },
        include: [
            {
                model: FlashSaleProduct,
                as: 'products',
                include: [
                    {
                        model: Product,
                        as: 'product',
                        include: [{ model: ProductImage, as: 'images' }]
                    }
                ],
                order: [['display_order', 'ASC']]
            }
        ]
    } as any);

    return flashSale;
}
