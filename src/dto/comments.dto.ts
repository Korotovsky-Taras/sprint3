import {
    CommentMongoModel,
    CommentPaginationQueryModel,
    CommentPaginationRepositoryModel,
    CommentViewModel
} from "../types/comments";

import {withExternalDirection, withExternalNumber, withExternalString,} from "../utils/withExternalQuery";

const initialQuery: CommentPaginationRepositoryModel = {
    sortBy: "createdAt",
    sortDirection: "desc",
    pageNumber: 1,
    pageSize: 10
}

export const CommentsDto = {
    comment({_id, content, commentatorInfo, createdAt}: CommentMongoModel): CommentViewModel {
        return {
            id: _id.toString(),
            content: content,
            commentatorInfo: commentatorInfo,
            createdAt: createdAt,
        }
    },
    allComments(list: CommentMongoModel[]): CommentViewModel[] {
        return list.map(CommentsDto.comment)
    },
    toRepoQuery(query: CommentPaginationQueryModel): CommentPaginationRepositoryModel {
        return {
            sortBy: withExternalString(initialQuery.sortBy, query.sortBy),
            sortDirection: withExternalDirection(initialQuery.sortDirection, query.sortDirection),
            pageNumber: withExternalNumber(initialQuery.pageNumber, query.pageNumber),
            pageSize: withExternalNumber(initialQuery.pageSize, query.pageSize)
        };
    },
}