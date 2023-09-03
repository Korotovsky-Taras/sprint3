import {createModel, CustomModel} from "../utils/createModel";
import {HydratedDocument} from "mongoose";
import {ObjectId} from "mongodb";
import {AuthSession, AuthSessionCreateModel, AuthSessionMongoModel} from "../../types/login";


export interface IAuthSessionMethods {

}

interface IAuthSessionModel extends CustomModel<AuthSessionMongoModel, IAuthSessionMethods> {
    createSession(inputModel: AuthSessionCreateModel): HydratedDocument<AuthSessionMongoModel>;
}

export const AuthSessionModel: IAuthSessionModel = createModel<AuthSession, AuthSessionMongoModel, IAuthSessionMethods, IAuthSessionModel>("AuthSession",{
    userId: {type: String, required: true},
    uuid: {type: String, required: true},
    ip: {type: String, required: true},
    userAgent: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
}, (schema) => {

    schema.static('createSession', function createBlog(inputModel: AuthSessionCreateModel) {
        const model : HydratedDocument<AuthSessionMongoModel> = new AuthSessionModel({
            _id: new ObjectId(inputModel.deviceId),
            userId: inputModel.userId,
            userAgent: inputModel.userAgent,
            ip: inputModel.ip,
            uuid: inputModel.uuid,
            lastActiveDate: inputModel.lastActiveDate
        });
        return model
    });

})
