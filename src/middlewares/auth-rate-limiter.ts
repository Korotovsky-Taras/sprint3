import {NextFunction, Request, Response} from "express";
import {rateLimiter, RateLimiterCounter} from "../managers/redisStore";
import {Status} from "../types";
import {authHelper} from "../managers/authHelper";

const RATE_LIMIT = 5; // Максимальное количество запросов за период времени
const PERIOD = 10; // Период времени в секундах


export const authRateLimiter = (limit: number = RATE_LIMIT, period: number = PERIOD) => {
    return async function (req: Request, res: Response, next: NextFunction) {

        const ip = authHelper.getIp(req);

        if (!ip) {
            return next();
        }

        const endpoint = req.path;

        const key = `${ip}:${endpoint}`;

        const count: RateLimiterCounter | undefined = rateLimiter.getCounter(key);

        if (!count || rateLimiter.getTtl(key) < 0) {
            await rateLimiter.setCounter(key, 1, period);
            return next();
        }

        await rateLimiter.incCounter(key);

        if (count.value < limit) {
            return next();
        }

        return res.sendStatus(Status.TO_MANY_REQUESTS);
    }
}