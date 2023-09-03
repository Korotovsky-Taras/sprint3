import {NextFunction, Request, Response} from "express";
import {Status} from "../types";
import {verifyAccessToken} from "../utils/tokenAdapter";
import {AuthAccessTokenPayload} from "../types/login";

export const authTokenAccessValidation = (withError: boolean = true) => {

    const validationNext = (res: Response, next: NextFunction) => {
        if (withError) {
            return res.sendStatus(Status.UNATHORIZED);
        }
        return next();
    }

    return (req: Request, res: Response, next: NextFunction) => {
        const {authorization} = req.headers;

        if (!authorization) {
            return validationNext(res, next);
        }

        const authorizationData = authorization.split(" ")
        const isTokenDataExist = authorizationData.length > 1 && authorizationData[0] === 'Bearer';

        if (!isTokenDataExist) {
            return validationNext(res, next);
        }

        const bearerToken = authorizationData[1];
        const verifiedAccessToken: AuthAccessTokenPayload | null = verifyAccessToken(bearerToken);

        if (!verifiedAccessToken) {
            return validationNext(res, next);
        }

        req.userId = verifiedAccessToken.userId;

        return next();
    }
}