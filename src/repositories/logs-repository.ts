import fs from "fs";
import {ensureLogsExist, logsPath} from "../utils/withMongoLogger";
import {ILogsRepository} from "../types/repository";
import {injectable} from "inversify";

@injectable()
export class LogsRepository implements ILogsRepository {
    async clear(): Promise<void> {
        return new Promise<void>((resolve) => {
            ensureLogsExist();
            fs.writeFile(logsPath, "", () => {
                resolve()
            });
        })
    }
}
