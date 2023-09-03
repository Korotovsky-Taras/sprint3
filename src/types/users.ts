import {EnhancedOmit, WithId} from "mongodb";
import {PaginationQueryModel, WithPagination, WithPaginationQuery} from "./custom";


export type User = {
    login: string,
    email: string,
    password: UserEncodedPassword,
    authConfirmation: UserConfirmation,
    passConfirmation: UserConfirmation,
    createdAt: string,
}

export type UserConfirmation = {
    expiredIn: string,
    code: string,
    confirmed: boolean,
}

export type UserEncodedPassword = {
    salt: string,
    hash: string
}

export type UserMongoModel = WithId<User>

export type UserConfirmationMongoModel = WithId<UserConfirmation>

export type UserCreateRequestModel = Pick<User, 'login' | 'email' > & {password: string};

export type UserCreateInputModel = Pick<User, 'login' | 'email' | 'password' | 'authConfirmation'>;

export type UserViewModel = Pick<User, 'login' | 'email' | 'createdAt'> & { id: string }

export type UserMeViewModel = Pick<User, 'login' | 'email'> & { userId: string }

export type UserWithConfirmedViewModel = Pick<User, 'login' | 'email' | 'createdAt'> & { id: string, confirmationCode: string, confirmed: boolean }

export type UserListViewModel = WithPagination<UserViewModel>

export type UserPaginationQueryModel = PaginationQueryModel<User> & {
    searchLoginTerm?: string,
    searchEmailTerm?: string
}

export type UserPaginationRepositoryModel = EnhancedOmit<WithPaginationQuery<User>, "searchLoginTerm" | "searchEmailTerm"> & {
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
}

export type UserConfirmationCodeValidateResult = {
    isConfirmed: boolean,
    isExpired: boolean,
}