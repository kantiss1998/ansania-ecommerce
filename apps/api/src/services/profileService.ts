
import { User } from '@repo/database';
import { NotFoundError, UnauthorizedError } from '@repo/shared/errors';
import { UpdateProfileDTO, ChangePasswordDTO } from '@repo/shared/schemas';
import bcrypt from 'bcryptjs';

export async function getProfile(userId: number) {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
    });
    if (!user) throw new NotFoundError('User');
    return user;
}

export async function updateProfile(userId: number, data: UpdateProfileDTO) {
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('User');

    await user.update(data);

    // Return updated user without password
    return getProfile(userId);
}

export async function changePassword(userId: number, data: ChangePasswordDTO) {
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('User');

    // Verify current password
    const isValid = await bcrypt.compare(data.current_password, user.password);
    if (!isValid) {
        throw new UnauthorizedError('Invalid current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.new_password, 10);
    await user.update({ password: hashedPassword });

    return { success: true };
}
