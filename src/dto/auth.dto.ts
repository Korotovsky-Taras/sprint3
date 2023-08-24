import {UserMongoModel} from "../types";
import {
    AuthMeViewModel,
    AuthSessionDataModel,
    AuthSessionMongoModel,
    AuthSessionValidationModel,
    AuthSessionViewModel
} from "../types/login";

export const AuthDto = {
    user({_id, email, login}: UserMongoModel): AuthMeViewModel {
        return {
            email: email,
            login: login,
            userId: _id.toString(),
        }
    },
    validationSession({_id, uuid}: AuthSessionMongoModel): AuthSessionValidationModel {
        return {
            uuid,
            deviceId: _id.toString(),
        }
    },
    viewSession({_id, lastActiveDate, ip, userAgent}: AuthSessionMongoModel): AuthSessionViewModel {
        return {
            ip,
            lastActiveDate,
            title: userAgent,
            deviceId: _id.toString(),
        }
    },
    dataSession({_id, userId, uuid}: AuthSessionMongoModel): AuthSessionDataModel {
        return {
            uuid,
            userId,
            deviceId: _id.toString(),
        }
    },
    sessions(sessions: AuthSessionMongoModel[]): AuthSessionViewModel[] {
        return sessions.map(session => {
            return AuthDto.viewSession(session)
        })
    },
}