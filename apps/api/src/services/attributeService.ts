
import { FilterColor, FilterSize, FilterFinishing } from '@repo/database';

export async function getColors() {
    // @ts-ignore
    return FilterColor.findAll({
        order: [['name', 'ASC']]
    });
}

export async function getSizes() {
    // @ts-ignore
    return FilterSize.findAll({
        order: [['name', 'ASC']]
    });
}

export async function getFinishings() {
    // @ts-ignore
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
