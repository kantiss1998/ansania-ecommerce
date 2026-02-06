
import { FilterColor, FilterSize, FilterFinishing } from '@repo/database';

export async function getColors() {
    return FilterColor.findAll({
        order: [['name', 'ASC']]
    });
}

export async function getSizes() {
    return FilterSize.findAll({
        order: [['name', 'ASC']]
    });
}

export async function getFinishings() {
    return FilterFinishing.findAll({
        order: [['name', 'ASC']]
    });
}

export async function getAllAttributes() {
    const [colors, sizes, finishings] = await Promise.all([
        getColors(),
        getSizes(),
        getFinishings()
    ]);

    return {
        colors,
        sizes,
        finishings
    };
}
