import {ServerApiVersion} from "mongodb";
import {appConfig} from "./utils/config";
import mongoose, {ConnectOptions} from "mongoose";

const {mongoUrl, dbName} = appConfig;

let connectOptions = {
    w: "majority",
    retryWrites: true,
    maxPoolSize: 20,
    dbName,
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
};


export const connectMongooseDb = async () => {
    try {
        console.log("Mongoose connecting... " + dbName);
        await mongoose.connect(mongoUrl, connectOptions as ConnectOptions);

        console.log("Mongoose connection status: ok");
    } catch (e: any) {
        console.log("Mongoose connection error: " + e.message);
        await connectDisconnectDb();
    }
}

export const connectDisconnectDb = async () => {
    console.log("Mongoose disconnect!");
    await mongoose.connection.close();
}
