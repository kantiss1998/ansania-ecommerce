
import { Address } from '@repo/database';
import { NotFoundError } from '@repo/shared/errors';
import { CreateAddressDTO } from '@repo/shared/schemas';

export async function createAddress(userId: number, data: CreateAddressDTO) {
    // If setting as default, unset other defaults
    if (data.is_default) {
        await Address.update({ is_default: false }, { where: { user_id: userId } });
    }

    const address = await Address.create({
        user_id: userId,
        ...data,
        is_default: data.is_default || false
    });

    // If it's the first address, make it default automatically?
    // Good UX practice.
    const count = await Address.count({ where: { user_id: userId } });
    if (count === 1) {
        await address.update({ is_default: true });
    }

    return address;
}

export async function getAddresses(userId: number) {
    return Address.findAll({
        where: { user_id: userId },
        order: [
            ['is_default', 'DESC'],
            ['created_at', 'DESC']
        ]
    });
}

export async function getAddress(userId: number, addressId: number) {
    const address = await Address.findOne({
        where: { id: addressId, user_id: userId }
    });
    if (!address) throw new NotFoundError('Address');
    return address;
}

export async function updateAddress(userId: number, addressId: number, data: Partial<CreateAddressDTO>) {
    const address = await getAddress(userId, addressId);

    if (data.is_default) {
        await Address.update({ is_default: false }, { where: { user_id: userId } });
    }

    await address.update(data);
    return address;
}

export async function deleteAddress(userId: number, addressId: number) {
    const address = await getAddress(userId, addressId);
    await address.destroy();
    return { success: true };
}

// Set an address as default
export async function setDefaultAddress(userId: number, addressId: number) {
    const address = await getAddress(userId, addressId);

    // Unset all other defaults
    await Address.update({ is_default: false }, { where: { user_id: userId } });

    // Set this address as default
    await address.update({ is_default: true });

    return address;
}

