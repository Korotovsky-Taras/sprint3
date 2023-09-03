import {
    CommentMongoModel,
    CommentPaginationQueryModel,
    CommentPaginationRepositoryModel,
    CommentViewModel
} from "../types/comments";

import {withExternalDirection, withExternalNumber, withExternalString,} from "../utils/withExternalQuery";
import {Like, LikesInfo, LikeStatus} from "../types/likes";

const initialQuery: CommentPaginationRepositoryModel = {
    sortBy: "createdAt",
    sortDirection: "desc",
    pageNumber: 1,
    pageSize: 10
}


function createLikesInfo(likes: Like[], userId: string | null) : LikesInfo {
    let likeInfo: LikesInfo = {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.NONE
    }
    likes.forEach(model => {
        if (model.userId === userId) {
            likeInfo.myStatus = model.status
        }
        if (model.status === LikeStatus.LIKE) {
            likeInfo.likesCount++;
        }
        if (model.status === LikeStatus.DISLIKE) {
            likeInfo.dislikesCount++;
        }
    })
    return likeInfo;
}

export const CommentsDto = {
    comment(comment: CommentMongoModel, userId: string | null): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
            likesInfo: createLikesInfo(comment.likes, userId)
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