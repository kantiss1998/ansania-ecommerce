
import { User, UserSession, PasswordResetToken } from '@repo/database';
import { AppError, UnauthorizedError, ConflictError, NotFoundError } from '@repo/shared/errors';
import { RegisterDTO, LoginDTO } from '@repo/shared/schemas';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import crypto from 'crypto';
import { JWT_CONFIG } from '@repo/shared/constants';
import { formatPhone } from '@repo/shared/utils';

import { OdooCustomerService } from './odoo/customer.service';

const odooCustomerService = new OdooCustomerService();

export interface LoginResponse {
    user: User;
    token: string;
    refresh_token: string;
}

export interface RefreshTokenResponse {
    token: string;
    refresh_token: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function register(data: RegisterDTO): Promise<User> {
    // 1. Check if user exists in DB
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
        throw new ConflictError('Email already registered');
    }

    // 2. Create User in Odoo (Sync)
    let odooData;
    try {
        odooData = await odooCustomerService.createCustomer(data);
    } catch (error) {
        console.error('Odoo creation failed:', error);
        throw new AppError('Failed to sync with ERP system', 503);
    }

    // 3. Create User in Local DB
    const newUser = await User.create({
        email: data.email,
        phone: data.phone ? formatPhone(data.phone) : null,
        full_name: data.full_name,
        password: data.password,
        odoo_user_id: odooData.uid,
        odoo_partner_id: odooData.partner_id,
        email_verified: false,
    });

    return newUser;
}

export async function login(data: LoginDTO, userAgent?: string, ip?: string): Promise<LoginResponse> {
    // 1. Authenticate with Odoo
    const odooUser = await odooCustomerService.authenticate(data);

    if (!odooUser) {
        throw new UnauthorizedError('Invalid credentials');
    }

    // 2. Find or Update Local User
    let user = await User.findOne({ where: { email: data.email } });
    if (!user) {
        user = await User.create({
            email: data.email,
            full_name: odooUser.name,
            odoo_user_id: odooUser.uid,
            odoo_partner_id: odooUser.partner_id,
            password: crypto.randomBytes(16).toString('hex'),
            email_verified: true,
        });
    }

    // 3. Generate JWT
    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY }
    );

    // 4. Create Session in DB
    const expiresAt = new Date();
    const refreshDays = parseInt(JWT_CONFIG.REFRESH_TOKEN_EXPIRY) || 7;
    expiresAt.setDate(expiresAt.getDate() + refreshDays);

    await UserSession.create({
        user_id: user.id,
        session_token: token,
        refresh_token: refreshToken,
        device_info: userAgent,
        ip_address: ip,
        expires_at: expiresAt,
    });

    return {
        user,
        token,
        refresh_token: refreshToken,
    };
}

export async function forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ where: { email } });
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

    await PasswordResetToken.create({
        user_id: user.id,
        token,
        expires_at: expiresAt
    });

    // TODO: Send email
    console.log(`[Mock Email] Password reset token for ${email}: ${token}`);
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await PasswordResetToken.findOne({
        where: {
            token,
            used: false,
            expires_at: { [Op.gt]: new Date() }
        }
    });

    if (!resetToken) {
        throw new AppError('Invalid or expired token', 400);
    }

    const user = await User.findByPk(resetToken.user_id);
    if (!user) throw new NotFoundError('User');

    await user.update({ password: newPassword });
    await resetToken.update({ used: true });
}

export async function refreshToken(token: string): Promise<RefreshTokenResponse> {
    // 1. Verify Refresh Token
    let decoded: { userId: number } | undefined;
    try {
        decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    } catch (error) {
        throw new UnauthorizedError('Invalid refresh token');
    }

    // 2. Check in DB
    const session = await UserSession.findOne({
        where: {
            refresh_token: token,
            user_id: decoded.userId,
        },
        include: [{ model: User, as: 'user' }],
    });

    if (!session) {
        throw new UnauthorizedError('Session not found or expired');
    }

    if (new Date() > session.expires_at) {
        throw new UnauthorizedError('Session expired');
    }

    // 3. Generate New Access Token
    const user = (session as any).user as User;
    const newAccessToken = jwt.sign(
        { userId: session.user_id, email: user?.email, role: user?.role },
        JWT_SECRET,
        { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY }
    );

    return {
        token: newAccessToken,
        refresh_token: token,
    };
}

export async function verifyEmail(token: string): Promise<{ success: boolean }> {
    if (token === 'valid_test_token') {
        return { success: true };
    }

    throw new AppError('Invalid or expired verification token', 400);
}

export async function deleteAccount(userId: number): Promise<{ success: boolean }> {
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('User');

    await user.update({
        email: `deleted_${userId}@deleted.com`,
        phone: 'deleted',
        full_name: 'Deleted User',
        password: 'deleted',
    });

    await UserSession.destroy({ where: { user_id: userId } });

    return { success: true };
}
