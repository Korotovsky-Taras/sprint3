import {PostMongoModel, PostPaginationQueryModel, PostPaginationRepositoryModel, PostViewModel} from "../types";
import {withExternalDirection, withExternalNumber, withExternalString,} from "../utils/withExternalQuery";
import {LastLike, Like, LikesExtendedInfo, LikeStatus} from "../types/likes";

const initialQuery: PostPaginationRepositoryModel = {
    sortBy: "createdAt",
    sortDirection: "desc",
    pageNumber: 1,
    pageSize: 10
}

function createLikesInfo(model: PostMongoModel, userId: string | null) : LikesExtendedInfo {
    const myLike = model.likes.find((like: Like) => like.userId === userId);
    return {
        likesCount: model.likesInfo.likesCount,
        dislikesCount: model.likesInfo.dislikesCount,
        myStatus: myLike ? myLike.status : LikeStatus.NONE,
        newestLikes: model.lastLikes.map((lastLike: LastLike) => {
            return {
                login: lastLike.userLogin,
                userId: lastLike.userId,
                addedAt: lastLike.createdAt
            }
        })
    };
}

export const PostsDto = {
    allPosts(items: PostMongoModel[], userId: string | null): PostViewModel[] {
        return items.map(item => {
            return PostsDto.post(item, userId)
        })
    },
    post(model: PostMongoModel, userId: string | null): PostViewModel {
        return {
            id: model._id.toString(),
            title: model.title,
            shortDescription: model.shortDescription,
            content: model.content,
            blogId: model.blogId,
            blogName: model.blogName,
            createdAt: model.createdAt,
            extendedLikesInfo: createLikesInfo(model, userId)
        }
    },
    toRepoQuery(query: PostPaginationQueryModel): PostPaginationRepositoryModel {
        return {
            sortBy: withExternalString(initialQuery.sortBy, query.sortBy),
            sortDirection: withExternalDirection(initialQuery.sortDirection, query.sortDirection),
            pageNumber: withExternalNumber(initialQuery.pageNumber, query.pageNumber),
            pageSize: withExternalNumber(initialQuery.pageSize, query.pageSize)
        };
    },
}
