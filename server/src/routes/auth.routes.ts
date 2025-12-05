import { AuthController } from "@/controllers/auth.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { RateLimitMiddleware } from "@/middlewares/rateLimit.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { githubAuthCallbackSchema } from "@/validators/github-authcallback.validator";
import { Router } from "express";

const router = Router();

// GitHub OAuth routes
router.get('/login/github', RateLimitMiddleware.loginLimiter, AuthController.loginWithGithub);
router.get('/github/callback', RateLimitMiddleware.loginLimiter, validate(githubAuthCallbackSchema), AuthController.githubOAuthCallback);

router.post('/logout', authenticate, AuthController.logout);

// user info
router.get('/me', authenticate, AuthController.getCurrentUser);

export default router;
