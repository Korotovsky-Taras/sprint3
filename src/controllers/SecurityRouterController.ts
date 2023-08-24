import {ISecurityRouterController, ParamIdModel, RequestWithParams, Status} from "../types";
import {NextFunction, Request, Response} from "express";
import {usersRepository} from "../repositories/users-repository";
import {AuthSessionViewModel} from "../types/login";


class SecurityRouterController implements ISecurityRouterController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        if (req.userId) {
           const sessions: AuthSessionViewModel[] =  await usersRepository.getAllAuthSessions(req.userId);
           return res.status(Status.OK).send(sessions);
        }
        return res.sendStatus(Status.UNATHORIZED);
    }
    async deleteAll(req: Request, res: Response, next: NextFunction) {
        if (req.userId && req.deviceId) {
            const isDeleted: boolean = await usersRepository.deleteAllSessions({
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
            const session = await usersRepository.findSessionByDeviceId(req.params.id);

            if (!session) {
                return res.sendStatus(Status.NOT_FOUND);
            }
            if (session.userId !== req.userId) {
                return res.sendStatus(Status.FORBIDDEN);
            }
            const isDeleted: boolean = await usersRepository.deleteSession(req.userId, req.params.id);
            if (isDeleted) {
                return res.sendStatus(Status.NO_CONTENT);
            }
        }
        return res.sendStatus(Status.UNATHORIZED);
    }
}

export const securityRouterController = new SecurityRouterController();