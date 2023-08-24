import {Request, Response} from "express";
import {ILogsRouterController, Log, Status} from "../types";
import {logsRepository} from "../repositories/logs-repository";


class LogsRouterController implements ILogsRouterController {
    async getAll(req: Request, res: Response<Log[]>) {
        try {
            const logs: Log[] = await logsRepository.getAll();
            return res.status(Status.OK).send(logs);
        } catch (e :any) {
            return res.status(Status.BAD_REQUEST).send(e);
        }
    }
    async deleteAll(req: Request, res: Response) {
        try {
            await logsRepository.deleteAll();
            return res.sendStatus(Status.NO_CONTENT);
        } catch (e :any) {
            return res.status(Status.BAD_REQUEST).send(e.toString());
        }
    }
}

export const logsRouterController = new LogsRouterController();