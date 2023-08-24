import {NextFunction, Request, Response} from "express";
import {Status} from "../types";
import {authHelper} from "../managers/authHelper";
import {AuthRefreshTokenPayload, AuthSessionValidationModel} from "../types/login";
import {verifyRefreshToken} from "../utils/tokenAdapter";
import {usersRepository} from "../repositories/users-repository";

export const authTokenRefreshValidation = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken : string | null = authHelper.getRefreshToken(req);

    if (refreshToken) {
        const tokenPass: AuthRefreshTokenPayload | null = verifyRefreshToken(refreshToken);

        if (tokenPass) {
            const session: AuthSessionValidationModel | null = await usersRepository.getAuthSession(tokenPass.userId, tokenPass.deviceId);

            if (session && session.uuid === tokenPass.uuid){
                req.userId = tokenPass.userId;
                req.deviceId = tokenPass.deviceId;
                return next();
            }
        }
    }
    return res.sendStatus(Status.UNATHORIZED);
}