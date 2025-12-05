import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { responseHandler } from '@/utils/responseHandler';

/**
 * Middleware to validate request data using Zod schemas
 * The schema should define body, params, and/or query validation
 */
export const validate = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse the entire request object with body, params, and query
            const validated = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            }) as {
                body?: any;
                params?: any;
                query?: any;
            };
            
            // Replace request data with sanitized/validated data
            if (validated.body) {
                req.body = validated.body;
            }
            if (validated.params) {
                req.params = validated.params;
            }
            if (validated.query) {
                // for query, update each property instead of reassigning
                Object.keys(req.query).forEach(key => delete req.query[key]);
                Object.assign(req.query, validated.query);
            }
            
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                
                return responseHandler.badRequest(res, 'Validation failed', errorMessages);
            }
            
            return responseHandler.serverError(res, 'Validation error');
        }
    };
};
