import {AuthSessionMongoModel} from "../types/login";
import {ObjectId} from "mongodb";
import {IAuthSessionQueryRepository} from "../types/repository";
import {AuthSessionModel} from "./models/AuthSession";
import {injectable} from "inversify";

@injectable()
export class AuthSessionQueryRepository implements IAuthSessionQueryRepository {
    async getAll<T>(userId: string, dto: (session: AuthSessionMongoModel[]) => T[]): Promise<T[]> {
        const sessions: AuthSessionMongoModel[] = await AuthSessionModel.find({userId}).lean<AuthSessionMongoModel[]>() as AuthSessionMongoModel[]
        return dto(sessions);
    }
    async getSessionByUserIdDeviceId<T>(userId: string, deviceId: string, dto: (session: AuthSessionMongoModel) => T): Promise<T | null> {
        const query = AuthSessionModel.where({userId, _id: new ObjectId(deviceId)})
        const session: AuthSessionMongoModel | null = await query.findOne().lean<AuthSessionMongoModel>() as AuthSessionMongoModel;
        if (session) {
            return dto(session)
        }
        return null;
    }
    async getSessionByDeviceId<T>(deviceId: string, dto: (session: AuthSessionMongoModel) => T): Promise<T | null> {
        const session: AuthSessionMongoModel | null = await AuthSessionModel.findById(deviceId).lean<AuthSessionMongoModel>() as AuthSessionMongoModel;
        if (session) {
            return dto(session);
        }
        return null;
    }
}