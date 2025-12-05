import { Request, Response, NextFunction } from 'express';
import { responseHandler } from '@/utils/responseHandler';
import { UserService } from '@/services/user.service';
import { hashSessionId } from '@/utils/generateSessionId';
import logger from '@/utils/logger';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
                email: string;
                username: string;
            };
        }
    }
}

/**
 * Middleware to authenticate requests using session cookie
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const sessionId = req.cookies.sessionId;

        if (!sessionId) {
            return responseHandler.unauthorized(res, 'No session found');
        }

        const hashedSessionId = hashSessionId(sessionId);

        const user = await UserService.findUserBySessionId(hashedSessionId);

        if (!user) {
            res.clearCookie('sessionId');
            return responseHandler.unauthorized(res, 'Invalid or expired session');
        }

        req.user = {
            userId: user._id.toString(),
            role: user.role,
            email: user.email,
            username: user.username,
        };

        next();
    } catch (error) {
        logger.error('Authentication middleware error:', error);
        return responseHandler.unauthorized(res, 'Authentication failed');
    }
}

/**
 * Middleware to check if user has required role
 */
export function roleChecker(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return responseHandler.unauthorized(res, 'Authentication required');
        }

        if (!allowedRoles.includes(req.user.role)) {
            return responseHandler.forbidden(res, 'Insufficient permissions');
        }

        next();
    };
}

/**
 * Optional authentication - doesn't block if no session
 */
export async function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
    try {
        const sessionId = req.cookies.sessionId;

        if (sessionId) {
            const hashedSessionId = hashSessionId(sessionId);
            const user = await UserService.findUserBySessionId(hashedSessionId);

            if (user) {
                req.user = {
                    userId: user._id.toString(),
                    role: user.role,
                    email: user.email,
                    username: user.username,
                };
            }
        }

        next();
    } catch (error) {
        next();
    }
}
