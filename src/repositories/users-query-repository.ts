import {
    UserConfirmationCodeValidateResult,
    UserMongoModel,
    UserPaginationRepositoryModel,
    WithPagination
} from "../types";
import {IUsersQueryRepository} from "../types/repository";
import {withModelPagination} from "./utils/withModelPagination";
import {IUserMethods, UserModel} from "./models/User";
import {FilterQuery, HydratedDocument} from "mongoose";

class UsersQueryRepository implements IUsersQueryRepository {

    async getUsers<T>(query: UserPaginationRepositoryModel, dto: (blog: UserMongoModel[]) => T[]): Promise<WithPagination<T>> {
        let filter: FilterQuery<UserMongoModel> = {};

        const searchLoginTermFilter: FilterQuery<UserMongoModel> | null = query.searchLoginTerm !== null ? {
            login: {
                $regex: query.searchLoginTerm,
                $options: "i"
            }
        } : null;
        const searchEmailTermFilter: FilterQuery<UserMongoModel> | null = query.searchEmailTerm !== null ? {
            email: {
                $regex: query.searchEmailTerm,
                $options: "i"
            }
        } : null;

        if (searchLoginTermFilter && searchEmailTermFilter) {
            filter = {$or: [searchEmailTermFilter, searchLoginTermFilter]}
        } else if (searchLoginTermFilter) {
            filter = searchLoginTermFilter
        } else if (searchEmailTermFilter) {
            filter = searchEmailTermFilter
        }

        return withModelPagination<UserMongoModel, T>(UserModel, filter, query, dto);
    }

    async getUserById<T>(userId: string, dto: (user: UserMongoModel) => T): Promise<T | null> {
        const user: UserMongoModel | null = await UserModel.findById(userId).lean<UserMongoModel>() as UserMongoModel;
        if (user) {
            return dto(user)
        }
        return null;
    }

    async isUserExistByLoginOrEmail(login: string, email: string): Promise<boolean> {
        const user: UserMongoModel | null = await UserModel.findOne().or([{email}, {login}]).lean<UserMongoModel>() as UserMongoModel;
        return user !== null;
    }

    async getUserByLoginOrEmail<T>(login: string, email: string, dto: (user: UserMongoModel) => T): Promise<T | null> {
        const user: UserMongoModel | null = await UserModel.findOne().or([{email}, {login}]).lean<UserMongoModel>() as UserMongoModel;
        if (user) {
            return dto(user)
        }
        return null;
    }

    async getAuthConfirmationValidation(code: string): Promise<UserConfirmationCodeValidateResult | null> {
        const user: HydratedDocument<UserMongoModel, IUserMethods> | null = await UserModel.findOne({
            'authConfirmation.code': code,
        }).exec();

        if (user) {
            return {
                isConfirmed: user.isAuthConfirmed(),
                isExpired: user.isAuthExpired(),
            }
        }
        return null;
    }

    async getPassConfirmationValidation(code: string): Promise<UserConfirmationCodeValidateResult | null> {
        const user: HydratedDocument<UserMongoModel, IUserMethods> | null = await UserModel.findOne({
            'passConfirmation.code': code,
        }).exec();

        if (user) {
            return {
                isConfirmed: user.isPassConfirmed(),
                isExpired: user.isPassExpired(),
            }
        }
        return null;
    }

    async getUserByFilter<T>(filter: FilterQuery<UserMongoModel>, dto: (user: UserMongoModel) => T): Promise<T | null> {
        const user = await UserModel.findOne(filter).exec();
        if (user) {
            return dto(user);
        }
        return null;
    }
}

export const usersQueryRepository = new UsersQueryRepository();