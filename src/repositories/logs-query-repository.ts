import {Log} from "../types";
import fs from "fs";
import {ensureLogsExist, logsNormalize, logsPath} from "../utils/withMongoLogger";
import {ILogsQueryRepository} from "../types/repository";


class LogsQueryRepository implements ILogsQueryRepository {
    async getAll(): Promise<Log[]> {
        return new Promise<Log[]>((resolve, reject) => {
            ensureLogsExist();
            fs.readFile(logsPath,  (err, data) => {
                if (err) reject(err.message);
                const logs: Log[] = logsNormalize(data);
                resolve(logs)
            });
        })
    }
}

export const logsQueryRepository = new LogsQueryRepository();