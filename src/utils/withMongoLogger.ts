import fs from "fs";
import {Log} from "../types";
import path from "path";
import {MongooseError} from "mongoose";
import {MongoError} from "mongodb";

const dateSpliterator = "[MongoErrorDate]: ";
const causeSpliterator = "[MongoErrorCause]: ";
const breakLineSpliterator = '\r\n';
export const logsPath = path.join(process.cwd(), 'logs', 'mongo.txt');

const logNormalize = (log: string): Log => {
    const [date, message] = log.includes(causeSpliterator) ? log.split(causeSpliterator) : ["", log];
    return {
        date,
        message
    }
}

export const logsNormalize = (data: Buffer): Log[] => {
    const dataText = data.toString("utf-8");
    return dataText.split(dateSpliterator).filter(i => !!i).map(logNormalize);
}

export function ensureLogsExist() {
    const dirName = path.dirname(logsPath);
    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
    }
    fs.appendFileSync(logsPath, "");
}


function writeError(error: Error) {
    let messages = error.message;
    if (error.stack) {
        const stack: string[] = error.stack.split('\n');
        if (stack.length > 1) {
            messages = `${stack[0]}${breakLineSpliterator}${stack[stack.length - 1]}`;
        }
    }
    return `\n${dateSpliterator}${new Date()}${breakLineSpliterator}${causeSpliterator}${messages}`;
}

export function withMongoLogger(error: Error) {
    if(error instanceof MongooseError || MongoError){
        fs.appendFile(logsPath, writeError(error), () => {});
    }
}