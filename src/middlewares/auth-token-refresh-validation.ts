import {NextFunction, Request, Response} from "express";
import {Status} from "../types";
import {authHelper} from "../managers/authHelper";
import {AuthRefreshTokenPayload, AuthSessionValidationModel} from "../types/login";
import {verifyRefreshToken} from "../utils/tokenAdapter";
import {AuthDto} from "../dto/auth.dto";
import {authSessionQueryRepository} from "../repositories";

export const authTokenRefreshValidation = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken : string | null = authHelper.getRefreshToken(req);

    if (refreshToken) {
        const tokenPass: AuthRefreshTokenPayload | null = verifyRefreshToken(refreshToken);

        if (tokenPass) {
            const session: AuthSessionValidationModel | null = await authSessionQueryRepository.getSessionByUserIdDeviceId(tokenPass.userId, tokenPass.deviceId, AuthDto.validationSession);

            if (session && session.uuid === tokenPass.uuid){
                req.userId = tokenPass.userId;
                req.deviceId = tokenPass.deviceId;
                return next();
            }
        }
    }
    return res.sendStatus(Status.UNATHORIZED);
}