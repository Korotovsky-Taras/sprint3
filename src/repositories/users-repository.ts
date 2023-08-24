import {withMongoLogger} from "../utils/withMongoLogger";
import {
    User,
    UserCreateModel,
    UserEncodedPassword,
    UserListViewModel,
    UserMongoModel,
    UserPaginationRepositoryModel,
    UserReplaceConfirmationData,
    UserViewModel,
    UserWithConfirmedViewModel
} from "../types";
import {authConfirmationCollection, authSessionsCollection, usersCollection} from "../db";
import {UsersDto} from "../dto/users.dto";
import {withMongoQueryFilterPagination} from "./utils";
import crypto from "node:crypto";
import {
    AuthAccessTokenPass,
    AuthConfirmation,
    AuthConfirmationMongoModel,
    AuthDeleteAllSessionsRepoModel,
    AuthLoginRepoModel,
    AuthLogoutRepoModel,
    AuthMeViewModel,
    AuthRefreshTokenPass,
    AuthRefreshTokenRepoModel,
    AuthSessionDataModel,
    AuthSessionMongoModel,
    AuthSessionValidationModel,
    AuthSessionViewModel,
    AuthTokens
} from "../types/login";
import {Filter, ObjectId} from "mongodb";
import {AuthDto} from "../dto/auth.dto";
import {randomUUID} from "crypto";
import {createAccessToken, createRefreshToken} from "../utils/tokenAdapter";
import {toIsoString} from "../utils/date";


export const usersRepository = {
    async getAll(query: UserPaginationRepositoryModel): Promise<UserListViewModel> {
        return withMongoLogger<UserListViewModel>(async () => {

            let filter: Filter<User> = {};

            const searchLoginTermFilter: Filter<User> | null = query.searchLoginTerm !== null ? {login: {$regex: query.searchLoginTerm, $options: "i" }} : null;
            const searchEmailTermFilter: Filter<User> | null = query.searchEmailTerm !== null ? {email: {$regex: query.searchEmailTerm, $options: "i" }} : null;

            if (searchLoginTermFilter && searchEmailTermFilter) {
                filter = {$or: [searchEmailTermFilter, searchLoginTermFilter]}
            } else if (searchLoginTermFilter) {
                filter = searchLoginTermFilter
            } else if (searchEmailTermFilter) {
                filter = searchEmailTermFilter
            }

            return withMongoQueryFilterPagination<User, UserViewModel>(usersCollection, UsersDto.allUsers, filter, query);
        });
    },
    async createUser(model: UserCreateModel): Promise<UserViewModel | null> {
        return withMongoLogger<UserViewModel | null>(async () => {

            const userExist: UserMongoModel | null = await usersCollection.findOne({$or: [{email: model.email}, {login: model.login}]});

            if (userExist) {
                return null;
            }

            const password: UserEncodedPassword = usersRepository._hashPassword(model.password);

            const newUser: User = {
                email: model.email,
                login: model.login,
                password,
                createdAt: toIsoString(new Date()),
                confirmed: true
            }

            const user = await usersCollection.insertOne(newUser)

            return UsersDto.user({
                _id: user.insertedId,
                ...newUser,
            })
        })
    },
    async createUserWithConfirmationCode(model: UserCreateModel): Promise<UserWithConfirmedViewModel | null> {
        return withMongoLogger<UserWithConfirmedViewModel | null>(async () => {

            const userExist: UserMongoModel | null = await usersCollection.findOne({$or: [{email: model.email}, {login: model.login}]});

            if (userExist) {
                return null;
            }

            const password: UserEncodedPassword = usersRepository._hashPassword(model.password);

            const newUser: User = {
                email: model.email,
                login: model.login,
                password,
                createdAt: toIsoString(new Date()),
                confirmed: false
            }

            const user = await usersCollection.insertOne(newUser);

            const confirmation: AuthConfirmation = usersRepository._createEmailConfirmation(user.insertedId.toString());
            await authConfirmationCollection.insertOne(confirmation);

            return UsersDto.userWithConfirmation({
                _id: user.insertedId,
                ...newUser,
            }, confirmation.code)
        })
    },
    async deleteUserById(userId: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await usersCollection.deleteOne({_id: new ObjectId(userId)});
            return result.deletedCount === 1;
        });
    },
    async loginUser(model: AuthLoginRepoModel): Promise<AuthTokens | null> {
        return withMongoLogger<AuthTokens | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({$or: [{email: model.loginOrEmail}, {login: model.loginOrEmail}]})
            if (user && user.confirmed) {
                const isVerified = usersRepository._verifyPassword(model.password, user.password.salt, user.password.hash);
                if (isVerified) {
                    const userId = user._id.toString();

                    const deviceId = new ObjectId();
                    const accessToken : AuthAccessTokenPass = createAccessToken(userId);
                    const refreshToken : AuthRefreshTokenPass = createRefreshToken(userId, deviceId.toString());

                    await authSessionsCollection.insertOne(
                        {
                            _id: deviceId,
                            userId,
                            userAgent: model.userAgent,
                            ip: model.ip,
                            uuid: refreshToken.uuid,
                            lastActiveDate: refreshToken.expiredIn
                        })

                    return {
                        accessToken : accessToken.token,
                        refreshToken: refreshToken.token
                    }
                }
            }
            return null;
        });
    },
    async logoutUser(model: AuthLogoutRepoModel): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const userId = model.userId;
            const deviceId = model.deviceId;
            const user: UserMongoModel | null =  await usersCollection.findOne({_id: new ObjectId(userId)});
            if (user && user.confirmed) {
                const res = await authSessionsCollection.deleteOne({userId, _id: new ObjectId(deviceId)});
                return res.deletedCount === 1;
            }
            return false;
        });
    },
    async refreshTokens(model: AuthRefreshTokenRepoModel): Promise<AuthTokens | null> {
        return withMongoLogger<AuthTokens | null>(async () => {
            const userId = model.userId;
            const userAgent = model.userAgent;
            const deviceId = model.deviceId;

            const user: UserMongoModel | null =  await usersCollection.findOne({_id: new ObjectId(userId)});

            if (user && user.confirmed) {

                const accessToken : AuthAccessTokenPass = createAccessToken(userId);
                const refreshToken : AuthRefreshTokenPass = createRefreshToken(userId, deviceId);

                await authSessionsCollection.updateOne({_id: new ObjectId(deviceId)}, {
                    $set: {
                        userAgent,
                        ip: model.ip,
                        uuid: refreshToken.uuid,
                        lastActiveDate: refreshToken.expiredIn
                    }
                })

                return {
                    accessToken: accessToken.token,
                    refreshToken: refreshToken.token,
                };
            }
            return null;
        });
    },
    async getUserWithConfirmationByEmail(email: string): Promise<UserWithConfirmedViewModel | null> {
        return withMongoLogger<UserWithConfirmedViewModel | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({ email })
            if (user) {
                const userId = user._id.toString();
                const authConfirmation: AuthConfirmationMongoModel | null = await authConfirmationCollection.findOne({ userId })
                if (authConfirmation) {
                    return UsersDto.userWithConfirmation(user, authConfirmation.code)
                }
            }
            return null;
        });
    },
    async isConfirmationCodeValid(code: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const authConfirmation: AuthConfirmationMongoModel | null = await authConfirmationCollection.findOne({ code })
            if (authConfirmation) {
                const user: UserMongoModel | null = await usersCollection.findOne({ _id: new ObjectId(authConfirmation.userId) })
                return user != null && !user.confirmed
            }
            return false;
        });
    },
    async getUserByLogin(login: string): Promise<UserViewModel | null> {
        return withMongoLogger<UserViewModel | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({ login })
            if (user) {
                return UsersDto.user(user)
            }
            return null;
        });
    },
    async getAuthUserById(userId: string): Promise<AuthMeViewModel | null> {
        return withMongoLogger<AuthMeViewModel | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({_id: new ObjectId(userId)})
            if (user) {
                return AuthDto.user(user)
            }
            return null;
        });
    },
    async getAuthSession(userId: string, deviceId: string): Promise<AuthSessionValidationModel | null> {
        return withMongoLogger<AuthSessionValidationModel | null>(async () => {
            const session: AuthSessionMongoModel | null = await authSessionsCollection.findOne({userId, _id: new ObjectId(deviceId)})
            if (session) {
                return AuthDto.validationSession(session)
            }
            return null;
        });
    },
    async getAllAuthSessions(userId: string): Promise<AuthSessionViewModel[]> {
        return withMongoLogger<AuthSessionViewModel[]>(async () => {
            const sessions: AuthSessionMongoModel[] = await authSessionsCollection.find({userId}).toArray()
            return AuthDto.sessions(sessions);
        });
    },
    async deleteAllSessions(model: AuthDeleteAllSessionsRepoModel): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await authSessionsCollection.deleteMany({
                _id: { $ne: new ObjectId(model.deviceId) },
                userId: model.userId
            });
            return result.deletedCount > 0;
        });
    },
    async deleteSession(userId: string, deviceId: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await authSessionsCollection.deleteOne({_id: new ObjectId(deviceId), userId})
            return result.deletedCount === 1;
        });
    },
    async findSessionByDeviceId(deviceId: string): Promise<AuthSessionDataModel | null> {
        return withMongoLogger<AuthSessionDataModel | null>(async () => {
            const session: AuthSessionMongoModel | null = await authSessionsCollection.findOne({_id: new ObjectId(deviceId)});
            if (session) {
                return AuthDto.dataSession(session);
            }
            return null;
        });
    },
    async verifyUserWithConfirmationCode(code: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const authConfirmation: AuthConfirmationMongoModel | null = await authConfirmationCollection.findOne({ code })
            if (authConfirmation) {
                const user : UserMongoModel | null = await usersCollection.findOne({_id: new ObjectId(authConfirmation.userId)});
                if (user && !user.confirmed) {
                    const isVerified = usersRepository._verifyExpiredDate(authConfirmation);
                    if (isVerified) {
                        await usersCollection.updateOne(user, {$set: { confirmed: true }})
                        return true;
                    }
                }
            }
            return false;
        });
    },
    async createUserReplaceConfirmationCode(email: string): Promise<UserReplaceConfirmationData | null> {
        return withMongoLogger<UserReplaceConfirmationData | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({ email });
            if (user && !user.confirmed) {
                const userId = user._id.toString();
                const confirmation: AuthConfirmation = usersRepository._createEmailConfirmation(userId);
                await authConfirmationCollection.updateOne({ userId }, {$set: {
                        code: confirmation.code,
                        expiredIn: confirmation.expiredIn,
                    }})
                return {
                    email,
                    code: confirmation.code,
                }
            }
            return null;
        });
    },
    async clear(): Promise<void> {
        return withMongoLogger<void>(async () => {
            await usersCollection.deleteMany({});
            await authConfirmationCollection.deleteMany({});
            await authSessionsCollection.deleteMany({});
        })
    },
    _hashPassword(password: string) : UserEncodedPassword {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = usersRepository._createPasswordHash(password, salt);
        return { salt, hash };
    },
    _verifyPassword(password: string, salt: string, hash: string): boolean {
        const newHash = usersRepository._createPasswordHash(password, salt);
        return newHash === hash;
    },
    _createPasswordHash(password: string, salt: string): string {
        return crypto.pbkdf2Sync(password, salt, 100, 24, 'sha512').toString('hex');
    },
    _createEmailConfirmation(userId: string): AuthConfirmation  {
        let expiredDate: Date = new Date();
        expiredDate.setTime(expiredDate.getTime() + 3 * 1000 * 60);
        return {
            userId,
            expiredIn: toIsoString(expiredDate),
            code: randomUUID(),
        }
    },
    _verifyExpiredDate(session: {expiredIn: string}): boolean  {
        const expTime = new Date(session.expiredIn).getTime();
        const currentTime = new Date().getTime();
        return currentTime < expTime;
    },
}