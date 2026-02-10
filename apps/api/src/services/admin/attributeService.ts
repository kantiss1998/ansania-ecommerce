
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

export async function listAllAttributes() {
    const [colors, sizes, finishing] = await Promise.all([
        listColors(),
        listSizes(),
        listFinishing()
    ]);

    return [
        {
            id: 1,
            name: 'Warna',
            code: 'color',
            type: 'select',
            is_required: true,
            values: colors.map((c: any) => ({
                id: c.id,
                attribute_id: 1,
                label: c.name,
                value: c.name.toLowerCase(),
                extra_data: c.hex_code
            }))
        },
        {
            id: 2,
            name: 'Ukuran',
            code: 'size',
            type: 'select',
            is_required: true,
            values: sizes.map((s: any) => ({
                id: s.id,
                attribute_id: 2,
                label: s.name,
                value: s.name.toLowerCase()
            }))
        },
        {
            id: 3,
            name: 'Finishing',
            code: 'finishing',
            type: 'select',
            is_required: false,
            values: finishing.map((f: any) => ({
                id: f.id,
                attribute_id: 3,
                label: f.name,
                value: f.name.toLowerCase()
            }))
        }
    ];
}
