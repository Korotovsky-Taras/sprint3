import {Request, Response} from "express";
import {ILogsRouterController, Log, Status} from "../types";
import {ILogsQueryRepository, ILogsRepository} from "../types/repository";
import {logsQueryRepository, logsRepository} from "../repositories";


class LogsRouterController implements ILogsRouterController {

    constructor(
        private readonly logsRepo: ILogsRepository,
        private readonly logsQueryRepo: ILogsQueryRepository,
    ) {
    }

    async getAll(req: Request, res: Response<Log[]>) {
        try {
            const logs: Log[] = await this.logsQueryRepo.getAll();
            return res.status(Status.OK).send(logs);
        } catch (e: any) {
            return res.status(Status.BAD_REQUEST).send(e);
        }
    }

    async deleteAll(req: Request, res: Response) {
        try {
            await this.logsRepo.clear();
            return res.sendStatus(Status.NO_CONTENT);
        } catch (e: any) {
            return res.status(Status.BAD_REQUEST).send(e.toString());
        }
    }
}

export const logsRouterController = new LogsRouterController(logsRepository, logsQueryRepository);