import {Log} from "../types";
import fs from "fs";
import {ensureLogsExist, logsNormalize, logsPath} from "../utils/withMongoLogger";

export const logsRepository = {
    async getAll(): Promise<Log[]> {
        return new Promise<Log[]>((resolve, reject) => {
            ensureLogsExist();
            fs.readFile(logsPath,  (err, data) => {
                if (err) reject(err.message);
                const logs: Log[] = logsNormalize(data);
                resolve(logs)
            });
        })
    },
    async deleteAll(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ensureLogsExist();
            fs.writeFile(logsPath, "", () => {
                resolve()
            });
        })
    },
}