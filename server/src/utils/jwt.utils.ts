import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '@/config/config';
import { RefreshTokenModel } from '@/models/RefreshToken';
import { IUserDocument } from '@/models/User';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

/**
 * Generate access token (short-lived, 15 minutes)
 */
export function generateAccessToken(user: IUserDocument): string {
    const payload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    };

    return jwt.sign(payload, config.jwt.SECRET, {
        expiresIn: config.jwt.ACCESS_TOKEN_EXPIRY,
    } as jwt.SignOptions);
}

/**
 * Generate refresh token (long-lived, 7 days) and store in database
 */
export async function generateRefreshToken(
    user: IUserDocument,
    ipAddress?: string
): Promise<string> {
    // Create a cryptographically secure random token
    const token = crypto.randomBytes(40).toString('hex');

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Save to database
    await RefreshTokenModel.create({
        userId: user._id,
        token,
        expiresAt,
        createdByIp: ipAddress,
    });

    return token;
}

/**
 * Generate both access and refresh tokens
 */
export async function generateAuthTokens(
    user: IUserDocument,
    ipAddress?: string
): Promise<AuthTokens> {
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, ipAddress);

    return { accessToken, refreshToken };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): TokenPayload {
    try {
        return jwt.verify(token, config.jwt.SECRET as string) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
}

/**
 * Verify and get refresh token from database
 */
export async function verifyRefreshToken(token: string) {
    const refreshToken = await RefreshTokenModel.findOne({ token });

    if (!refreshToken) {
        throw new Error('Invalid refresh token');
    }

    if (refreshToken.revokedAt) {
        throw new Error('Refresh token has been revoked');
    }

    if (refreshToken.expiresAt < new Date()) {
        throw new Error('Refresh token has expired');
    }

    return refreshToken;
}

/**
 * Revoke refresh token (for logout)
 */
export async function revokeRefreshToken(
    token: string,
    ipAddress?: string
): Promise<void> {
    const refreshToken = await RefreshTokenModel.findOne({ token });

    if (!refreshToken) {
        throw new Error('Invalid refresh token');
    }

    refreshToken.revokedAt = new Date();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

/**
 * Revoke all refresh tokens for a user (for logout from all devices)
 */
export async function revokeAllUserTokens(
    userId: string,
    ipAddress?: string
): Promise<void> {
    await RefreshTokenModel.updateMany(
        { userId, revokedAt: null },
        { 
            revokedAt: new Date(),
            revokedByIp: ipAddress 
        }
    );
}

/**
 * Rotate refresh token (revoke old, generate new)
 */
export async function rotateRefreshToken(
    oldToken: string,
    user: IUserDocument,
    ipAddress?: string
): Promise<string> {
    // Generate new token
    const newToken = await generateRefreshToken(user, ipAddress);

    // Revoke old token and mark it as replaced
    const oldRefreshToken = await RefreshTokenModel.findOne({ token: oldToken });
    if (oldRefreshToken) {
        oldRefreshToken.revokedAt = new Date();
        oldRefreshToken.revokedByIp = ipAddress;
        oldRefreshToken.replacedByToken = newToken;
        await oldRefreshToken.save();
    }

    return newToken;
}

/**
 * Clean up expired tokens (can be run as a cron job)
 */
export async function cleanupExpiredTokens(): Promise<number> {
    const result = await RefreshTokenModel.deleteMany({
        expiresAt: { $lt: new Date() }
    });

    return result.deletedCount || 0;
}
