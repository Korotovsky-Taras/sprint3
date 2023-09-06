import {
    CommentMongoModel,
    CommentPaginationQueryModel,
    CommentPaginationRepositoryModel,
    CommentViewModel
} from "../types/comments";

import {withExternalDirection, withExternalNumber, withExternalString,} from "../utils/withExternalQuery";
import {Like, LikeStatus} from "../types/likes";

const initialQuery: CommentPaginationRepositoryModel = {
    sortBy: "createdAt",
    sortDirection: "desc",
    pageNumber: 1,
    pageSize: 10
}


export const CommentsDto = {
    comment(comment: CommentMongoModel, userId: string | null): CommentViewModel {
        const myLike = comment.likes.find((like: Like) => like.userId === userId);
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: myLike ? myLike.status : LikeStatus.NONE,
            }
        }
    },
    allComments(list: CommentMongoModel[], userId: string | null): CommentViewModel[] {
        return list.map(comment => {
            return CommentsDto.comment(comment, userId)
        })
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