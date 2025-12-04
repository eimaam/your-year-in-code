import { OAuth2Client } from 'google-auth-library';
import { config } from '@/config/config';

const client = new OAuth2Client(config.google.CLIENT_ID);

/**
 * Verify Google ID token (from @react-oauth/google)
 * This is the only function needed for the modern React OAuth flow
 * 
 * @param token - Google ID token received from frontend
 * @returns User information from Google
 */
export async function verifyGoogleToken(token: string) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: config.google.CLIENT_ID,
        });

        const payload = ticket.getPayload();
        
        if (!payload || !payload.email) {
            throw new Error('Invalid token payload');
        }

        return {
            googleId: payload.sub,
            email: payload.email,
            fullName: payload.name || payload.email.split('@')[0],
            avatarUrl: payload.picture || '',
            emailVerified: payload.email_verified || false,
        };
    } catch (error) {
        throw new Error('Invalid Google token');
    }
}
