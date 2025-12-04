import {NodeEnv} from "@shared/types";

const NODE_ENVIRONMENT = (import.meta.env.NODE_ENV as NodeEnv) || NodeEnv.DEVELOPMENT;

// GitHub OAuth
const github = {
  CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID || "",
  REDIRECT_URI: import.meta.env.VITE_GITHUB_REDIRECT_URI || "http://localhost:8000/api/v1/auth/github/callback",
};

// app config export
const app = {
    NAME: import.meta.env.VITE_APP_NAME || "Your Year in Code",
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000",
    API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
}

export const config = {
  NODE_ENVIRONMENT,
  github,
  app,
};
