import {
    IUsersService,
    UserConfirmation,
    UserCreateRequestModel,
    UserEncodedPassword,
    UserMongoModel,
    UserViewModel
} from "../types";
import {IUserMethods, UserModel} from "../repositories/models/User";
import {UsersDto} from "../dto/users.dto";
import {
    AuthAccessTokenPass,
    AuthLoginRepoModel,
    AuthLogoutRepoModel,
    AuthNewPasswordCreationModel,
    AuthRefreshTokenPass,
    AuthRefreshTokenRepoModel,
    AuthRegisterConfirmationModel,
    AuthRegisterModel,
    AuthResendingEmailModel,
    AuthServiceResultModel,
    AuthSessionMongoModel,
    AuthTokens
} from "../types/login";
import {injectable} from "inversify";

import {mailSender} from "../managers/mailSender";
import {HydratedDocument} from "mongoose";
import crypto from "node:crypto";
import {toIsoString} from "../utils/date";
import {randomUUID} from "crypto";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {createAccessToken, createRefreshToken} from "../utils/tokenAdapter";
import {AuthSessionModel} from "../repositories/models/AuthSession";
import {UsersRepository} from "../repositories/users-repository";
import {AuthSessionRepository} from "../repositories/auth-session-repository";
import {UsersQueryRepository} from "../repositories/users-query-repository";

@injectable()
export class UsersService implements IUsersService {

    constructor(
        private readonly usersRepo: UsersRepository,
        private readonly sessionRepo: AuthSessionRepository,
        private readonly usersQueryRepo: UsersQueryRepository,
    ) {
    }

    /**
     * Создаст пользователя c подтверждениeм авторизации
     */
    async registerUser(model: AuthRegisterModel): Promise<AuthServiceResultModel> {
        const isUserRegistered: boolean = await this.usersQueryRepo.isUserExistByLoginOrEmail(model.email, model.login)

        if (!isUserRegistered) {
            const user = UserModel.createUser({
                login: model.login,
                email: model.email,
                password: this._hashPassword(model.password),
                authConfirmation: this._createUserConfirmation()
            });

            await this.usersRepo.saveDoc(user);

            mailSender.sendRegistrationMail(user.email, user.authConfirmation.code).then();

            return {
                success: true
            }
        }
        return {
            success: false
        }
    }

    /**
     * Создаст пользователя без подтверждения авторизации
     */
    async createUser(model: UserCreateRequestModel): Promise<UserViewModel | null> {

        const isUserRegistered = await this.usersQueryRepo.isUserExistByLoginOrEmail(model.login, model.email);

        if (isUserRegistered) {
            return null;
        }

        const user = UserModel.createUser({
            login: model.login,
            email: model.email,
            password: this._hashPassword(model.password),
            authConfirmation: this._createUserConfirmation(true)
        });

        await this.usersRepo.saveDoc(user);

        return UsersDto.user(user);
    }

    async deleteUser(userId: string): Promise<boolean> {
        const result: DeleteResult = await UserModel.deleteOne({_id: new ObjectId(userId)}).exec();
        return result.deletedCount === 1;
    }

    async login(model: AuthLoginRepoModel): Promise<AuthTokens | null> {
        const user: HydratedDocument<UserMongoModel> | null = await UserModel.findOne().or([{email: model.loginOrEmail}, {login: model.loginOrEmail}]).exec()

        if (!user) {
            return null;
        }

        const isConfirmed : boolean = user.authConfirmation.confirmed;

        if (!isConfirmed) {
            return  null;
        }

        const isVerified = this._verifyPassword(model.password, user.password.salt, user.password.hash);

        if (!isVerified) {
            return null
        }

        const userId = user._id.toString();

        const deviceId = new ObjectId();
        const accessToken : AuthAccessTokenPass = createAccessToken(userId);
        const refreshToken : AuthRefreshTokenPass = createRefreshToken(userId, deviceId.toString());

        const session = AuthSessionModel.createSession({
            deviceId: deviceId.toString(),
            userId,
            userAgent: model.userAgent,
            ip: model.ip,
            uuid: refreshToken.uuid,
            lastActiveDate: refreshToken.expiredIn
        });

        await this.sessionRepo.saveDoc(session);

        return {
            accessToken : accessToken.token,
            refreshToken: refreshToken.token
        }
    }

    async logout(model: AuthLogoutRepoModel): Promise<boolean> {
        const userId = model.userId;
        const deviceId = model.deviceId;
        const user: HydratedDocument<UserMongoModel, IUserMethods> | null =  await UserModel.findById(userId).exec();

        if (!user) {
            return false;
        }

        if (!user.isAuthConfirmed()) {
            return false;
        }

        const res: DeleteResult = await AuthSessionModel.deleteOne({userId, _id: new ObjectId(deviceId)}).exec();
        return res.deletedCount === 1;
    }

    async refreshTokens(model: AuthRefreshTokenRepoModel): Promise<AuthTokens | null> {
        const userId = model.userId;
        const userAgent = model.userAgent;
        const deviceId = model.deviceId;

        const user: HydratedDocument<UserMongoModel, IUserMethods> | null =  await UserModel.findById(userId).exec();

        if (!user) {
            return null;
        }

        if (!user.isAuthConfirmed()) {
            return null;
        }

        const session : HydratedDocument<AuthSessionMongoModel> | null = await AuthSessionModel.findById(deviceId).exec();

        if (!session) {
            return null;
        }

        const accessToken : AuthAccessTokenPass = createAccessToken(userId);
        const refreshToken : AuthRefreshTokenPass = createRefreshToken(userId, deviceId);

        const res: UpdateResult = await AuthSessionModel.updateOne({_id: new ObjectId(deviceId)}, {
            $set: {
                userAgent,
                ip: model.ip,
                uuid: refreshToken.uuid,
                lastActiveDate: refreshToken.expiredIn
            }
        }).exec();

        if (res.modifiedCount == 0) {
            return null;
        }

        return {
            accessToken: accessToken.token,
            refreshToken: refreshToken.token,
        };
    }

    async verifyConfirmationCode(model: AuthRegisterConfirmationModel): Promise<AuthServiceResultModel> {

        const user: HydratedDocument<UserMongoModel, IUserMethods> | null  = await UserModel.findOne({
            'authConfirmation.code': model.code,
        }).exec();

        if (!user || user.isAuthConfirmed() || user.isAuthExpired()) {
            return {
                success: false
            }
        }

        user.setAuthConfirmed(true);

        await this.usersRepo.saveDoc(user);

        return {
            success: true
        }
    }

    async tryResendConfirmationCode(model: AuthResendingEmailModel): Promise<void> {
        const user: HydratedDocument<UserMongoModel, IUserMethods> | null = await UserModel.findOne({ email: model.email }).exec();

        if (user && !user.isAuthConfirmed()) {
            user.setAuthConfirmation(this._createUserConfirmation());

            await this.usersRepo.saveDoc(user);

            mailSender.sendRegistrationMail(user.email, user.authConfirmation.code).then();
        }

    }

    async tryResendPasswordRecoverCode(model: AuthResendingEmailModel): Promise<void> {
        const user: HydratedDocument<UserMongoModel, IUserMethods> | null = await UserModel.findOne({ email: model.email }).exec();
        if (user) {
            user.setPassConfirmation(this._createUserConfirmation())

            await this.usersRepo.saveDoc(user);

            mailSender.sendPasswordRecoveryMail(user.email, user.passConfirmation.code).then();
        }
    }

    async recoverPasswordWithConfirmationCode(model: AuthNewPasswordCreationModel): Promise<boolean> {
        const user: HydratedDocument<UserMongoModel, IUserMethods> | null = await UserModel.findOne({
            'passConfirmation.code': model.recoveryCode,
        }).exec();


        if (!user || user.isPassExpired() || user.isPassConfirmed()) {
            return false;
        }

        user.password = this._hashPassword(model.newPassword);
        user.setPassConfirmed(true);

        await this.usersRepo.saveDoc(user);

        return true;
    }


    _hashPassword(password: string) : UserEncodedPassword {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = this._createPasswordHash(password, salt);
        return { salt, hash };
    }
    _verifyPassword(password: string, salt: string, hash: string): boolean {
        const newHash = this._createPasswordHash(password, salt);
        return newHash === hash;
    }
    _createPasswordHash(password: string, salt: string): string {
        return crypto.pbkdf2Sync(password, salt, 100, 24, 'sha512').toString('hex');
    }
    _createUserConfirmation(confirmed: boolean = false): UserConfirmation  {
        let expiredDate: Date = new Date();
        expiredDate.setTime(expiredDate.getTime() + 3 * 1000 * 60);
        return {
            expiredIn: toIsoString(expiredDate),
            code: randomUUID(),
            confirmed,
        }
    }
}
