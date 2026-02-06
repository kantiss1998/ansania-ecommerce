
import { FlashSale, FlashSaleProduct, Product, ProductImage } from '@repo/database';
import { Op } from 'sequelize';

export async function getActiveFlashSales() {
    const now = new Date();
    const flashSales = await FlashSale.findAll({
        where: {
            is_active: true,
            start_time: { [Op.lte]: now },
            end_time: { [Op.gte]: now }
        } as any,
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
                // @ts-ignore
                order: [['display_order', 'ASC']]
            }
        ],
        order: [['start_time', 'ASC']]
    });

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
                // @ts-ignore
                order: [['display_order', 'ASC']]
            }
        ]
    });

    return flashSale;
}
