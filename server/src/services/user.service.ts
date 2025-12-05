import { UserModel } from "@/models/User";
import { IUser } from "@shared/types";



export class UserService {

    /**
     * Find user by ID
     * @param id - User ID
     * @returns IUserDocument or null
     */
    static async findUserById(id: string) {
        const user = await UserModel.findById(id);
        return user;
    }

    /**
     * Find user by GitHub ID
     * @param githubId - GitHub user ID
     * @returns IUserDocument or null
     */
    static async findUserByGitHubId(githubId: number) {
        const user = await UserModel.findOne({ githubId });
        return user;
    }

    static async createOrUpdateGithubUser(userData: Partial<IUser>) {
        console.log("executing createOrUpdateGithubUser with data:", userData);
        let user = await UserModel.findOne({ githubId: userData.githubId });
        console.log("Found user:", user);
        if (user) {
            // Update existing user
            user = await UserModel.findOneAndUpdate(
                { githubId: userData.githubId },
                userData,
                { new: true }
            );
            return user;
        }

        console.log("user not found ==> Creating new user with data:", userData);
        // Create new user
        user = await UserModel.create(userData);
        return user;
    }

    /**
     * Store or update the session ID for a user
     * @param userId - mongo ID of the user
     * @param sessionId - session ID to store
     * @returns 
     */
    static async storeUserSession(userId: string, sessionId: string) {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { sessionId },
            { new: true }
        );
        return user;
    }

    /**
     * Find user by hashed session ID
     * @param hashedSessionId - hashed session ID
     * @returns IUserDocument or null
     */
    static async findUserBySessionId(hashedSessionId: string) {
        const user = await UserModel.findOne({ hashedSessionId });
        return user;
    }

    /**
     * Clear the stored session ID for a user
     * @param userId - mongo ID of the user
     * @returns 
     */
    static async clearUserSession(userId: string) {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $unset: { hashedSessionId: "" } },
            { new: true }
        );
        return user;
    }
     
}