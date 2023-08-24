import {IAuthRouterController, RequestWithBody, Status} from "../types";
import {NextFunction, Request, Response} from "express";
import {authService} from "../services/AuthService";
import {
    AuthLoginReqModel,
    AuthMeViewModel,
    AuthRegisterConfirmationModel,
    AuthRegisterModel,
    AuthServiceResultModel,
    AuthTokens
} from "../types/login";
import {authHelper} from "../managers/authHelper";


class AuthRouterController implements IAuthRouterController {
    async login(req: RequestWithBody<AuthLoginReqModel>, res: Response, next: NextFunction) {

        const auth: AuthTokens | null = await authService.login({
            loginOrEmail: req.body.loginOrEmail,
            password: req.body.password,
            userAgent: authHelper.getUserAgent(req),
            ip: authHelper.getIp(req)
        });

        if (auth) {
            authHelper.applyRefreshToken(res, auth.refreshToken);
            return res.status(Status.OK).send({
                accessToken: auth.accessToken,
            })
        }
        return res.sendStatus(Status.UNATHORIZED)
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        if (req.userId && req.deviceId) {
            const isLogout: boolean = await authService.logout({
                userId: req.userId,
                deviceId: req.deviceId,
            });
            if (isLogout) {
                authHelper.clearRefreshToken(res);
                return res.sendStatus(Status.NO_CONTENT)
            }
        }
        return res.sendStatus(Status.UNATHORIZED)
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        if (req.userId && req.deviceId) {
            const auth: AuthTokens | null = await authService.refreshTokens({
                userId: req.userId,
                deviceId: req.deviceId,
                userAgent: authHelper.getUserAgent(req),
                ip: authHelper.getIp(req)
            });
            if (auth) {
                authHelper.applyRefreshToken(res, auth.refreshToken);
                return res.status(Status.OK).send({
                    accessToken: auth.accessToken
                })
            }
        }
        return res.sendStatus(Status.UNATHORIZED)
    }

    async me(req: Request, res: Response<AuthMeViewModel>, next: NextFunction) {
        if (req.userId) {
            const model: AuthMeViewModel | null = await authService.getAuthUserById(req.userId);

            if (model) {
                return res.status(Status.OK).send(model)
            }
        }
        return res.sendStatus(Status.UNATHORIZED)
    }

    async registration(req: RequestWithBody<AuthRegisterModel>, res: Response, next: NextFunction) {
        const result: AuthServiceResultModel = await authService.registerUser(req.body);
        if (result.success) {
            return res.sendStatus(Status.NO_CONTENT)
        }
        return res.sendStatus(Status.BAD_REQUEST);
    }

    async registrationConfirmation(req: RequestWithBody<AuthRegisterConfirmationModel>, res: Response, next: NextFunction) {
        const result: AuthServiceResultModel = await authService.verifyConfirmationCode(req.body);
        if (result.success) {
            return res.sendStatus(Status.NO_CONTENT)
        }
        return res.sendStatus(Status.BAD_REQUEST);
    }

    async registrationEmailResending(req: Request, res: Response, next: NextFunction) {
        const result: AuthServiceResultModel = await authService.tryResendConfirmationCode(req.body);
        if (result.success) {
            return res.sendStatus(Status.NO_CONTENT)
        }
        return res.sendStatus(Status.BAD_REQUEST);
    }
}

export const authRouterController = new AuthRouterController();