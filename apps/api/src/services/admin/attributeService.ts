
import { FilterColor, FilterSize, FilterFinishing } from '@repo/database';
import { NotFoundError } from '@repo/shared/errors';

// Colors
export async function listColors(): Promise<FilterColor[]> {
    return FilterColor.findAll({ order: [['name', 'ASC']] });
}

export async function createColor(data: Partial<FilterColor>): Promise<FilterColor> {
    return FilterColor.create(data as any);
}

export async function updateColor(id: number, data: Partial<FilterColor>): Promise<FilterColor> {
    const color = await FilterColor.findByPk(id);
    if (!color) throw new NotFoundError('Color not found');
    return color.update(data);
}

export async function deleteColor(id: number): Promise<{ success: boolean }> {
    const color = await FilterColor.findByPk(id);
    if (!color) throw new NotFoundError('Color not found');
    await color.destroy();
    return { success: true };
}

// Sizes
export async function listSizes(): Promise<FilterSize[]> {
    return FilterSize.findAll({ order: [['name', 'ASC']] });
}

export async function createSize(data: Partial<FilterSize>): Promise<FilterSize> {
    return FilterSize.create(data as any);
}

export async function updateSize(id: number, data: Partial<FilterSize>): Promise<FilterSize> {
    const size = await FilterSize.findByPk(id);
    if (!size) throw new NotFoundError('Size not found');
    return size.update(data);
}

export async function deleteSize(id: number): Promise<{ success: boolean }> {
    const size = await FilterSize.findByPk(id);
    if (!size) throw new NotFoundError('Size not found');
    await size.destroy();
    return { success: true };
}

// Finishing
export async function listFinishing(): Promise<FilterFinishing[]> {
    return FilterFinishing.findAll({ order: [['name', 'ASC']] });
}

export async function createFinishing(data: Partial<FilterFinishing>): Promise<FilterFinishing> {
    return FilterFinishing.create(data as any);
}

export async function updateFinishing(id: number, data: Partial<FilterFinishing>): Promise<FilterFinishing> {
    const finishing = await FilterFinishing.findByPk(id);
    if (!finishing) throw new NotFoundError('Finishing not found');
    return finishing.update(data);
}

export async function deleteFinishing(id: number): Promise<{ success: boolean }> {
    const finishing = await FilterFinishing.findByPk(id);
    if (!finishing) throw new NotFoundError('Finishing not found');
    await finishing.destroy();
    return { success: true };
}

export interface AttributeResult {
    id: number;
    name: string;
    code: string;
    type: string;
    is_required: boolean;
    values: {
        id: number;
        attribute_id: number;
        label: string;
        value: string;
        extra_data?: string | null;
    }[];
}

export async function listAllAttributes(): Promise<AttributeResult[]> {
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
            values: colors.map(c => ({
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
            values: sizes.map(s => ({
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
            values: finishing.map(f => ({
                id: f.id,
                attribute_id: 3,
                label: f.name,
                value: f.name.toLowerCase()
            }))
        }
    ];
}
