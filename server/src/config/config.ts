import {NodeEnv} from "@shared/types";
import dotenv from "dotenv";
dotenv.config();

const NODE_ENVIRONMENT = (process.env.NODE_ENV as NodeEnv) || NodeEnv.DEVELOPMENT;
const DEV_MONGODB_URI = process.env.DEV_MONGODB_URI || "mongodb://localhost:27017/year-in-code-dev";
const PROD_MONGODB_URI = process.env.PROD_MONGODB_URI || "mongodb://localhost:27017/year-in-code-prod";
const MONGODB_URI = NODE_ENVIRONMENT === NodeEnv.PRODUCTION  ? PROD_MONGODB_URI : DEV_MONGODB_URI;

// jwt
const jwt: { [key: string]: string } = {
  SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",
};

// Google OAuth
const google = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || "http://localhost:8000/api/auth/google/callback",
};

// GitHub OAuth
const github = {
  CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
  CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
  REDIRECT_URI: process.env.GITHUB_REDIRECT_URI || "http://localhost:8000/api/v1/auth/github/callback",
};

// app config export
const app = {
    NAME: process.env.APP_NAME || "Your Year in Code",
    PORT: process.env.PORT || 4000,
    BASE_URL: process.env.APP_BASE_URL || `http://localhost:${process.env.APP_PORT || 4000}`,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
}

export const config = {
  NODE_ENVIRONMENT,
  MONGODB_URI,
  jwt,
  google,
  github,
  app,
};
