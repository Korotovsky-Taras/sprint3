import {
    UserMeViewModel,
    UserMongoModel,
    UserPaginationQueryModel,
    UserPaginationRepositoryModel,
    UserViewModel,
    UserWithConfirmedViewModel
} from "../types";
import {
    withExternalDirection,
    withExternalNumber,
    withExternalString,
    withExternalTerm,
} from "../utils/withExternalQuery";

const initialQuery: UserPaginationRepositoryModel = {
    sortBy: "createdAt",
    searchEmailTerm: null,
    searchLoginTerm: null,
    sortDirection: "desc",
    pageNumber: 1,
    pageSize: 10
}

export const UsersDto = {
    me({_id, login, email}: UserMongoModel): UserMeViewModel {
        return {
            userId: _id.toString(),
            login,
            email,
        }
    },
    user({_id, login, email, createdAt}: UserMongoModel): UserViewModel {
        return {
            id: _id.toString(),
            login,
            email,
            createdAt,
        }
    },
    allUsers(list: UserMongoModel[]): UserViewModel[] {
        return list.map(UsersDto.user)
    },
    userWithAuthConfirmation(userModel: UserMongoModel): UserWithConfirmedViewModel {
        return {
            ...UsersDto.user(userModel),
            confirmed: userModel.authConfirmation.confirmed,
            confirmationCode: userModel.authConfirmation.code,
        }
    },
    toRepoQuery(query: UserPaginationQueryModel): UserPaginationRepositoryModel {
        return {
            searchLoginTerm: withExternalTerm(initialQuery.searchLoginTerm, query.searchLoginTerm),
            searchEmailTerm: withExternalTerm(initialQuery.searchEmailTerm, query.searchEmailTerm),
            sortBy: withExternalString(initialQuery.sortBy, query.sortBy),
            sortDirection: withExternalDirection(initialQuery.sortDirection, query.sortDirection),
            pageNumber: withExternalNumber(initialQuery.pageNumber, query.pageNumber),
            pageSize: withExternalNumber(initialQuery.pageSize, query.pageSize)
        };
    },
}