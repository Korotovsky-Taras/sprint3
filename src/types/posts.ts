import {WithId} from "mongodb";
import {PaginationQueryModel, WithPagination, WithPaginationQuery} from "./custom";

export type Post = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export type PostMongoModel = WithId<Post>

export type PostsCreateModel = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;

export type PostsUpdateModel = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;

export type PostViewModel = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId' | 'blogName' | 'createdAt'> & {id: string}

export type PostsCommentCreateModel = {
    content: string,
}

export type PostsListMongoModel = WithPagination<PostMongoModel>

export type PostsListViewModel = WithPagination<PostViewModel>

export type PostPaginationQueryModel = PaginationQueryModel<Post>

export type PostPaginationRepositoryModel = WithPaginationQuery<Post>
