import {IAuthRouterController, IUsersService, RequestWithBody, Status, UserMeViewModel} from "../types";
import {NextFunction, Request, Response} from "express";
import {
    AuthLoginReqModel,
    AuthNewPasswordCreationModel,
    AuthRegisterConfirmationModel,
    AuthRegisterModel,
    AuthServiceResultModel,
    AuthTokens
} from "../types/login";
import {authHelper} from "../managers/authHelper";
import {UsersDto} from "../dto/users.dto";
import {usersService} from "../services/UsersService";
import {IAuthSessionQueryRepository, IUsersQueryRepository} from "../types/repository";
import {authSessionQueryRepository, usersQueryRepository} from "../repositories";


export class AuthRouterController implements IAuthRouterController {

    constructor(
        private readonly userService: IUsersService,
        private readonly authQueryRepo: IAuthSessionQueryRepository,
        private readonly userQueryRepo: IUsersQueryRepository,
    ) {
    }

    async login(req: RequestWithBody<AuthLoginReqModel>, res: Response, next: NextFunction) {

        const auth: AuthTokens | null = await this.userService.login({
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
            const isLogout: boolean = await this.userService.logout({
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
            const auth: AuthTokens | null = await this.userService.refreshTokens({
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

    async me(req: Request, res: Response<UserMeViewModel>, next: NextFunction) {
        if (req.userId) {
            const user: UserMeViewModel | null = await this.userQueryRepo.getUserById(req.userId, UsersDto.me);

            if (user) {
                return res.status(Status.OK).send(user)
            }
        }
        return res.sendStatus(Status.UNATHORIZED)
    }

    async registration(req: RequestWithBody<AuthRegisterModel>, res: Response, next: NextFunction) {
        const result: AuthServiceResultModel = await this.userService.registerUser(req.body);
        if (result.success) {
            return res.sendStatus(Status.NO_CONTENT)
        }
        return res.sendStatus(Status.BAD_REQUEST);
    }

    async registrationConfirmation(req: RequestWithBody<AuthRegisterConfirmationModel>, res: Response, next: NextFunction) {
        const result: AuthServiceResultModel = await this.userService.verifyConfirmationCode(req.body);
        if (result.success) {
            return res.sendStatus(Status.NO_CONTENT)
        }
        return res.sendStatus(Status.BAD_REQUEST);
    }

    async registrationEmailResending(req: Request, res: Response, next: NextFunction) {
        await this.userService.tryResendConfirmationCode(req.body);
        return res.sendStatus(Status.NO_CONTENT)
    }

    async passwordRecovery(req: Request, res: Response, next: NextFunction) {
        await this.userService.tryResendPasswordRecoverCode(req.body);
        return res.sendStatus(Status.NO_CONTENT)
    }

    async recoverPasswordWithConfirmationCode(req: RequestWithBody<AuthNewPasswordCreationModel>, res: Response, next: NextFunction) {
        const isUpdated: boolean = await this.userService.recoverPasswordWithConfirmationCode(req.body);
        if (isUpdated) {
            return res.sendStatus(Status.NO_CONTENT)
        }
        return res.sendStatus(Status.BAD_REQUEST)
    }
}

export const authRouterController = new AuthRouterController(usersService, authSessionQueryRepository, usersQueryRepository);