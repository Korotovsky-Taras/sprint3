import fs from "fs";
import {ApiError} from "./ApiError";
import {Log, Status} from "../types";
import path from "path";

const dateSpliterator = "$$$";
const logSpliterator = '\r\n';
export const logsPath = path.join(process.cwd(), 'logs', 'mongo.txt');

const logNormalize = (log: string): Log => {
    const [date, message] = log.includes(dateSpliterator) ? log.split(dateSpliterator) : ["", log];
    return {
        date,
        message
    }
}

export const logsNormalize = (data: Buffer): Log[] => {
    const dataText = data.toString("utf-8");
    return dataText.split(logSpliterator).filter(i => !!i).map(logNormalize);
}

export function ensureLogsExist() {
    const dirName = path.dirname(logsPath);
    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
    }
    fs.appendFileSync(logsPath, "");
}

export async function withMongoLogger<T>(fn: () => Promise<T>) {
    try {
        return await fn();
    } catch (err: any) {
        fs.appendFile(logsPath, `${new Date()}${dateSpliterator}${err.message}${logSpliterator}`, () => {});
        throw new ApiError(Status.DB_ERROR, [{
                message: err.message,
                field: "database"
            }])
    }
}