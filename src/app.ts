import express, {Express} from "express";
import errorHandling from "./middlewares/error-handling";
import {
    authRoutes,
    blogRoutes,
    commentsRoutes,
    logsRoutes,
    postsRoutes,
    securityRoutes,
    testingRoutes,
    usersRoutes
} from "./routes";
import {connectRouter} from "./utils/routerConnect";
import cookieParser from "cookie-parser";

export const app: Express = express();

// app.set('trust proxy', true);

app.use(express.json())
app.use(cookieParser())

connectRouter(authRoutes)
connectRouter(usersRoutes)
connectRouter(logsRoutes)
connectRouter(blogRoutes)
connectRouter(postsRoutes)
connectRouter(testingRoutes)
connectRouter(commentsRoutes)
connectRouter(securityRoutes)

app.use(errorHandling);

