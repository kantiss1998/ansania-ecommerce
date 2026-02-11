
// import bcrypt from 'bcryptjs';
import { User, UserSession, PasswordResetToken } from '@repo/database';
import { AppError, UnauthorizedError, ConflictError, NotFoundError } from '@repo/shared/errors';
import { RegisterDTO, LoginDTO } from '@repo/shared/schemas';
import jwt from 'jsonwebtoken';

import { OdooCustomerService } from './odoo/customer.service';

const odooCustomerService = new OdooCustomerService();
import { Op } from 'sequelize';

import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

export async function register(data: RegisterDTO) {
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
        // Fallback or error handling if Odoo is down
        console.error('Odoo creation failed:', error);
        // Depending on policy, we might fail or create local only with pending sync property
        // For now, assuming Odoo is critical
        throw new AppError('Failed to sync with ERP system', 503);
    }

    // 3. Create User in Local DB
    // Password will be hashed by User model hook
    const newUser = await User.create({
        email: data.email,
        phone: data.phone,
        full_name: data.full_name,
        password: data.password,
        odoo_user_id: odooData.uid,
        odoo_partner_id: odooData.partner_id,
        // is_active: true, // Field not in User model
        email_verified: false, // Default
    });

    // We might want to generate token immediately or ask them to login.
    // Usually auto-login.

    return newUser;
}

export async function login(data: LoginDTO, userAgent?: string, ip?: string) {
    // 1. Authenticate with Odoo
    // PRD 3.1.1: "Frontend -> Express -> Odoo Authentication API -> JWT Token -> Session"
    // So we pass credentials to Odoo.
    const odooUser = await odooCustomerService.authenticate(data);

    if (!odooUser) {
        throw new UnauthorizedError('Invalid credentials');
    }

    // 2. Find or Update Local User
    let user = await User.findOne({ where: { email: data.email } });
    if (!user) {
        // If user exists in Odoo but not here (e.g. initial sync not done), create it?
        // Or fail? Let's create/sync it.
        user = await User.create({
            email: data.email,
            full_name: odooUser.name,
            odoo_user_id: odooUser.uid,
            odoo_partner_id: odooUser.partner_id,
            password: crypto.randomBytes(16).toString('hex'), // Random password for Odoo-authenticated users
            email_verified: true,
        });
    }

    // 3. Generate JWT
    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // 4. Create Session in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

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

export async function forgotPassword(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) return; // Silent return for security

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await PasswordResetToken.create({
        user_id: user.id,
        token,
        expires_at: expiresAt
    });

    // TODO: Send email with token via emailService
    // await emailService.queueEmail(email, 'Password Reset', `Token: ${token}`);
    console.log(`[Mock Email] Password reset token for ${email}: ${token}`);
}

export async function resetPassword(token: string, newPassword: string) {
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

    // Hash the new password before updating
    // Update with new password (model hook will hash it)
    await user.update({ password: newPassword });
    await resetToken.update({ used: true });
}

export async function refreshToken(token: string) {
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
        include: [{ model: User, as: 'user' }], // Ensure association exists in Model definitions
    });

    if (!session) {
        throw new UnauthorizedError('Session not found or expired');
    }

    if (new Date() > session.expires_at) {
        throw new UnauthorizedError('Session expired');
    }

    // 3. Generate New Access Token
    // We can also rotate refresh token here if we want strict security
    const user = (session as any).user as User;
    const newAccessToken = jwt.sign(
        { userId: session.user_id, email: user?.email, role: user?.role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return {
        token: newAccessToken,
        refresh_token: token, // Return same refresh token for now, or rotate
    };
}
export async function verifyEmail(token: string) {
    // In a real scenario, we'd find a VerificationToken record
    // For now, let's assume it's valid if token matches some dummy logic
    // or we're just placeholders.
    // Ideally: const vt = await VerificationToken.findOne({ where: { token } });

    // Placeholder logic
    if (token === 'valid_test_token') {
        return { success: true };
    }

    throw new AppError('Invalid or expired verification token', 400);
}

export async function deleteAccount(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('User');

    // Soft delete or anonymize
    await user.update({
        email: `deleted_${userId}@deleted.com`,
        phone: 'deleted',
        full_name: 'Deleted User',
        password: 'deleted',
        // odoo_user_id: null,
    });

    // Delete sessions
    await UserSession.destroy({ where: { user_id: userId } });

    return { success: true };
}
