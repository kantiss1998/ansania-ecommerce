
import { FilterColor, FilterSize, FilterFinishing } from '@repo/database';
import { NotFoundError } from '@repo/shared/errors';

// Colors
export async function listColors() {
    return FilterColor.findAll({ order: [['name', 'ASC']] });
}

export async function createColor(data: any) {
    return FilterColor.create(data);
}

export async function updateColor(id: number, data: any) {
    const color = await FilterColor.findByPk(id);
    if (!color) throw new NotFoundError('Color not found');
    return color.update(data);
}

export async function deleteColor(id: number) {
    const color = await FilterColor.findByPk(id);
    if (!color) throw new NotFoundError('Color not found');
    await color.destroy();
    return { success: true };
}

// Sizes
export async function listSizes() {
    return FilterSize.findAll({ order: [['name', 'ASC']] });
}

export async function createSize(data: any) {
    return FilterSize.create(data);
}

export async function updateSize(id: number, data: any) {
    const size = await FilterSize.findByPk(id);
    if (!size) throw new NotFoundError('Size not found');
    return size.update(data);
}

export async function deleteSize(id: number) {
    const size = await FilterSize.findByPk(id);
    if (!size) throw new NotFoundError('Size not found');
    await size.destroy();
    return { success: true };
}

// Finishing
export async function listFinishing() {
    return FilterFinishing.findAll({ order: [['name', 'ASC']] });
}

export async function createFinishing(data: any) {
    return FilterFinishing.create(data);
}

export async function updateFinishing(id: number, data: any) {
    const finishing = await FilterFinishing.findByPk(id);
    if (!finishing) throw new NotFoundError('Finishing not found');
    return finishing.update(data);
}

export async function deleteFinishing(id: number) {
    const finishing = await FilterFinishing.findByPk(id);
    if (!finishing) throw new NotFoundError('Finishing not found');
    await finishing.destroy();
    return { success: true };
}
