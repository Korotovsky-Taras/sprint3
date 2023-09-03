import fs from "fs";
import {ensureLogsExist, logsPath} from "../utils/withMongoLogger";
import {ILogsRepository} from "../types/repository";

class LogsRepository implements ILogsRepository {
    async clear(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ensureLogsExist();
            fs.writeFile(logsPath, "", () => {
                resolve()
            });
        })
    }
}

export const logsRepository = new LogsRepository()