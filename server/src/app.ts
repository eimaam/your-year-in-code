import dotenv from "dotenv"
dotenv.config()
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { RateLimitMiddleware } from "./middlewares/rateLimit.middleware"
// routes
// import healthRoutes from "./routes/health.routes"
// import userRoutes from "./routes/user.routes"
// import authRoutes from "./routes/auth.routes"

import { connectDatabase } from "./config/database"
import cookieParser from "cookie-parser"
import { handleControllerError, responseHandler } from "./utils/responseHandler"
import { loggers } from "@/utils/logger"
import { config } from "./config/config"

const app = express()
const PORT = config.app.PORT

// cors
app.use(cors({
    origin: config.app.FRONTEND_URL,
    optionsSuccessStatus: 200,
    credentials: true,
}))

// rate limiter
app.use("/api/v1/", RateLimitMiddleware.generalLimiter)


// body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser()); // Parse cookies

// API routes
// app.use("/health", healthRoutes)

// // auth
// app.use("/api/v1/auth", authRoutes)

// // user routes
// app.use("/api/v1/users", userRoutes)


// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        message: 'Your Year in Code API Server',
        version: '1.0.0',
        documentation: '/api/docs',
    });
});


// 404 handler
app.use((_req, res) => {
    return responseHandler.notFound(
        res,
        "The requested resource was not found."
    )
})

// global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    return handleControllerError(err, res);
})

// start server
const startServer = async () => {
    try {
        await connectDatabase()
        app.listen(PORT, () => {
            loggers.server.started(Number(PORT), config.NODE_ENVIRONMENT);
        })
    } catch (error) {
        console.error("Error starting server:", error)
    }
}

startServer()

export default app