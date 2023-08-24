import {MongoClient, ServerApiVersion} from "mongodb";
import {Blog, Post, User} from "./types";
import {appConfig} from "./utils/config";
import {Comment} from "./types/comments";
import {AuthConfirmation, AuthSession} from "./types/login";

const {mongoUrl} = appConfig;

const client = new MongoClient(mongoUrl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const db = client.db(process.env.NODE_ENV);

export const blogsCollection = db.collection<Blog>("blogs");
export const usersCollection = db.collection<User>("users");
export const authSessionsCollection = db.collection<AuthSession>("authSession");
export const authConfirmationCollection = db.collection<AuthConfirmation>("authConfirmation");

export const postsCollection = db.collection<Post>("posts");
export const commentsCollection = db.collection<Comment>("comments");

export const connectDb = async () => {
    try {
        console.log("Mongodb connecting...");
        await client.connect();
        await client.db().command({ping: 1})
        console.log("Mongodb connection status: ok");
    } catch (e: any) {
        console.log("Mongodb connection error: " + e.message);
        await client.close();
    }
}