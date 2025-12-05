import { config } from "@/config/config";
import { OAuthApp } from "@octokit/oauth-app";
import { Octokit } from "@octokit/rest";


export class GithubService {
    static githubOAuth = new OAuthApp({
        clientType: "oauth-app",
        clientId: config.github.CLIENT_ID,
        clientSecret: config.github.CLIENT_SECRET,
    })

    /**
     * Get an Octokit instance with the provided GitHub OAuth token.
     * @param token GitHub OAuth token
     * @returns Octokit instance
     */
    static getOctokitInstance(token: string) {
        return new Octokit({
            auth: token,
        });
    }

    static async createTokenFromCode(code: string) {
        const tokenResponse = await this.githubOAuth.createToken({
            code,
        });
        return tokenResponse.authentication.token;
    }
}