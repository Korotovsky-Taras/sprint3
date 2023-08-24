import {
    UserListMongoModel,
    UserListViewModel,
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
    allUsers(list: UserListMongoModel): UserListViewModel {
        return {
            pagesCount: list.pagesCount,
            page: list.page,
            pageSize: list.pageSize,
            totalCount: list.totalCount,
            items: list.items.map(UsersDto.user)
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
    userWithConfirmation(userModel: UserMongoModel, confirmationCode: string): UserWithConfirmedViewModel {
        return {
            ...UsersDto.user(userModel),
            confirmed: userModel.confirmed,
            confirmationCode: confirmationCode,
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