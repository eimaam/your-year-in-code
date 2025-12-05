import { Request, Response } from 'express';
import { NodeEnv, UserRoleEnum } from '@shared/types';
import { catchAsAsync } from '@/utils/catchAsAsync';
import { responseHandler, sendSuccess } from '@/utils/responseHandler';
import { config } from '@/config/config';
import { GithubService } from '@/services/github.service';
import { UserService } from '@/services/user.service';
import { TokenService } from '@/services/token.service';
import { generateAndHashSessionId } from '@/utils/generateSessionId';

export class AuthController {
    /**
     * Login with GitHub (Handle GitHub OAuth callback)
     * GET /auth/login/github
     */
    static loginWithGithub = catchAsAsync(async (_req: Request, res: Response) => {
        const redirectUrl = GithubService.githubOAuth.getWebFlowAuthorizationUrl({
            scopes: ['read:user', 'user:email', 'repo'],
        })
        return sendSuccess({
            res,
            message: 'GitHub OAuth URL generated successfully',
            data: { url: redirectUrl.url },
        });
    });

    /**
     * GitHub OAuth callback handler
     * GET /auth/github/callback
     */
    static githubOAuthCallback = catchAsAsync(async (req: Request, res: Response) => {
        const { code } = req.query;
        console.log({ code });
        if (!code) {
            return responseHandler.badRequest(res, 'Authorization code is required');
        }

        // Exchange code for access token
        const githubAccessToken = await GithubService.createTokenFromCode(code as string);
        console.log({ githubAccessToken });

        // Get user information from GitHub
        // initialize octokit with the access token
        const octokit = GithubService.getOctokitInstance(githubAccessToken);

        // get authenticated user info
        const { data: githubUser } = await octokit.rest.users.getAuthenticated();

        // store or update user in database

        // encrypt the github access token before storing
        const encryptedGithubToken = TokenService.encrypt(githubAccessToken);

        const userData = {
            fullName: githubUser.name || 'No Name',
            role: UserRoleEnum.USER,
            username: githubUser.login,
            email: githubUser.email || githubUser.notification_email || `${githubUser.id}@users.noreply.github.com`,
            githubId: githubUser.id.toString(),
            avatarUrl: githubUser.avatar_url,
            githubAccessToken: encryptedGithubToken,
        }

        const user = await UserService.createOrUpdateGithubUser(userData);

        if (!user) {
            return responseHandler.serverError(res, 'Failed to create or update user');
        }

        // create internal session
        const { newSessionId, hashedSessionId } = generateAndHashSessionId();

        // store session ID with user
        await UserService.storeUserSession(user._id.toString(), hashedSessionId);

        // set session cookie
        res.cookie('sessionId', newSessionId, {
            httpOnly: true,
            secure: config.NODE_ENVIRONMENT === NodeEnv.PRODUCTION,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        console.log({ user });
        console.log("sessionId", newSessionId);
        console.log("githubAccessToken", githubAccessToken);
        console.log("cookie ==>", req.cookies);



        return sendSuccess({
            res,
            message: 'GitHub access token generated successfully',
            data: { user },
        });
    });


    /**
     * Logout (revoke refresh token)
     * POST /auth/logout
     */
    static logout = catchAsAsync(async (req: Request, res: Response) => {
        const sessionId = req.cookies['sessionId'];

        if (sessionId) {
            await UserService.clearUserSession(sessionId);
        }

        // Clear cookie
        res.clearCookie('sessionId');

        sendSuccess({
            res,
            message: 'Logged out successfully',
        });
    });

    /**
     * Logout from all devices (revoke all refresh tokens)
     * POST /auth/logout-all
     */
    static logoutFromAllDevices = catchAsAsync(async (req: Request, res: Response) => {
        if (!req.user) {
            return responseHandler.unauthorized(res, 'Authentication required');
        }

        await UserService.clearUserSession(req.user.userId);

        // Clear cookie
        res.clearCookie('refreshToken');

        sendSuccess({
            res,
            message: 'Logged out from all devices successfully',
        });
    });

    /**
     * Get current authenticated user info
     * GET /auth/me
     */
    static getCurrentUser = catchAsAsync(async (req: Request, res: Response) => {
        if (!req.user) {
            return responseHandler.unauthorized(res, 'Authentication required');
        }

        const user = await UserService.findUserById(req.user.userId);

        if (!user) {
            return responseHandler.notFound(res, 'User not found');
        }

        sendSuccess({
            res,
            message: 'User retrieved successfully',
            data: user,
        });
    });
}
