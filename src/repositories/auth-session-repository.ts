import {IAuthSessionRepository} from "../types/repository";
import {AuthSessionCreateModel, AuthSessionMongoModel, AuthSessionRemoveModel} from "../types/login";
import {DeleteResult, ObjectId} from "mongodb";
import {AuthSessionModel} from "./models/AuthSession";
import {HydratedDocument} from "mongoose";
import {injectable} from "inversify";

@injectable()
export class AuthSessionRepository implements IAuthSessionRepository {
    async createSession(input: AuthSessionCreateModel): Promise<string> {
        const session = AuthSessionModel.createSession(input);
        await session.save();
        return session._id.toString();
    }

    async getSessionByDeviceId<T>(deviceId: string, dto: (model: AuthSessionMongoModel) => T): Promise<T | null> {
        const session: AuthSessionMongoModel | null = await AuthSessionModel.findById(deviceId).lean<AuthSessionMongoModel>() as AuthSessionMongoModel;
        if (session) {
            return dto(session);
        }
        return null;
    }

    async deleteSession(input: AuthSessionRemoveModel): Promise<boolean> {
        const res: DeleteResult = await AuthSessionModel.deleteOne({userId: input.userId, _id: new ObjectId(input.deviceId)}).exec();
        return res.deletedCount === 1;
    }

    async deleteAllSessions(model: AuthSessionRemoveModel): Promise<boolean> {
        const result: DeleteResult = await AuthSessionModel.deleteMany({
            _id: {$ne: new ObjectId(model.deviceId)},
            userId: model.userId
        }).exec();
        return result.deletedCount > 0;
    }

    async saveDoc(doc: HydratedDocument<AuthSessionMongoModel>): Promise<void> {
        await doc.save()
    }

    async clear(): Promise<void> {
        await AuthSessionModel.deleteMany({});
    }
}