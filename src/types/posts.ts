import {WithId} from "mongodb";
import {PaginationQueryModel, WithPaginationQuery} from "./custom";
import {LastLike, Like, LikesInfo, LikeStatus, WithExtendedLikes} from "./likes";

export type Post = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    likes: Like[],
    likesInfo: LikesInfo,
    lastLikes: LastLike[],
    createdAt: string,
}

export type PostMongoModel = WithId<Post>

export type PostsCreateModel = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId' | 'blogName'>;

export type PostsUpdateModel = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;

export type PostViewModel = WithExtendedLikes<Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId' | 'blogName' | 'createdAt'> & {id: string}>

export type PostsCommentCreateModel = {
    content: string,
}

export type PostsLikeStatusInputModel = {
    postId: string,
    userId: string,
    status: LikeStatus
};

export type PostPaginationQueryModel = PaginationQueryModel<Post>

export type PostPaginationRepositoryModel = WithPaginationQuery<Post>
