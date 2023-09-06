import {ISecurityRouterController, ParamIdModel, RequestWithParams, Status} from "../types";
import {NextFunction, Request, Response} from "express";
import {AuthSessionViewModel} from "../types/login";
import {AuthDto} from "../dto/auth.dto";
import {injectable} from "inversify";
import {AuthSessionRepository} from "../repositories/auth-session-repository";
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {AuthSessionQueryRepository} from "../repositories/auth-session-query-repository";

@injectable()
export class SecurityRouterController implements ISecurityRouterController {

    constructor(
        private authSessionRepo: AuthSessionRepository,
        private usersQueryRepo: UsersQueryRepository,
        private authSessionQueryRepo: AuthSessionQueryRepository,
    ) {
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        if (req.userId) {
            const sessions: AuthSessionViewModel[] = await this.authSessionQueryRepo.getAll(req.userId, AuthDto.sessions);
            return res.status(Status.OK).send(sessions);
        }
        return res.sendStatus(Status.UNATHORIZED);
    }

    async deleteAll(req: Request, res: Response, next: NextFunction) {
        if (req.userId && req.deviceId) {
            const isDeleted: boolean = await this.authSessionRepo.deleteAllSessions({
                userId: req.userId,
                deviceId: req.deviceId
            });
            if (isDeleted) {
                return res.sendStatus(Status.NO_CONTENT);
            }
            return res.sendStatus(Status.NOT_FOUND);
        }
        return res.sendStatus(Status.UNATHORIZED);
    }

    async deleteDevice(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        if (req.userId && req.deviceId) {
            const session = await this.authSessionRepo.getSessionByDeviceId(req.params.id, AuthDto.dataSession);

            if (!session) {
                return res.sendStatus(Status.NOT_FOUND);
            }
            if (session.userId !== req.userId) {
                return res.sendStatus(Status.FORBIDDEN);
            }
            const isDeleted: boolean = await this.authSessionRepo.deleteSession({
                deviceId: req.params.id,
                userId: req.userId
            });
            if (isDeleted) {
                return res.sendStatus(Status.NO_CONTENT);
            }
        }
        return res.sendStatus(Status.UNATHORIZED);
    }
}
