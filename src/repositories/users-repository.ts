import {IUsersRepository} from "../types/repository";
import {AuthSessionModel} from "./models/AuthSession";
import {UserModel} from "./models/User";
import {HydratedDocument} from "mongoose";
import {UserMongoModel} from "../types";
import {injectable} from "inversify";

@injectable()
export class UsersRepository implements IUsersRepository {
    async saveDoc(doc: HydratedDocument<UserMongoModel>): Promise<void> {
        await doc.save()
    }
    async clear(): Promise<void> {
        await UserModel.deleteMany({});
        await AuthSessionModel.deleteMany({});
    }
}