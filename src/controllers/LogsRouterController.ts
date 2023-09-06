import {Request, Response} from "express";
import {ILogsRouterController, Log, Status} from "../types";
import {injectable} from "inversify";
import {LogsRepository} from "../repositories/logs-repository";
import {LogsQueryRepository} from "../repositories/logs-query-repository";


@injectable()
export class LogsRouterController implements ILogsRouterController {

    constructor(
        private readonly logsRepo: LogsRepository,
        private readonly logsQueryRepo: LogsQueryRepository,
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
