import {WithPagination, WithPaginationQuery} from "./custom";
import {Blog, BlogCreateModel, BlogMongoModel, BlogUpdateModel} from "./blogs";
import {UserConfirmationCodeValidateResult, UserMongoModel, UserPaginationRepositoryModel} from "./users";
import {AuthSessionCreateModel, AuthSessionMongoModel, AuthSessionRemoveModel,} from "./login";
import {Log} from "./logs";
import {PostMongoModel, PostPaginationRepositoryModel, PostsCreateModel, PostsUpdateModel} from "./posts";
import {CommentMongoModel, CommentPaginationRepositoryModel, CommentUpdateModel} from "./comments";
import {FilterQuery, HydratedDocument} from "mongoose";
import {ICommentMethods} from "../repositories/models/Comment";


export interface IRepository<T> {
    clear(): Promise<void>
    saveDoc(doc: HydratedDocument<T>): Promise<void>
}

export interface IQueryRepository {
}

export interface IUsersRepository extends IRepository<UserMongoModel> {

}

export interface IUsersQueryRepository {
    getUsers<T>(query: UserPaginationRepositoryModel, dto: (blog: UserMongoModel[]) => T[]): Promise<WithPagination<T>>
    getUserById<T>(userId: string, dto: (input: UserMongoModel) => T): Promise<T | null>
    getUserByFilter<T>(filter: FilterQuery<UserMongoModel>, dto: (user: UserMongoModel) => T): Promise<T | null>
    isUserExistByLoginOrEmail(login: string, email: string): Promise<boolean>
    getUserByLoginOrEmail<T>(login: string, email: string, dto: (user: UserMongoModel) => T): Promise<T | null>
    getAuthConfirmationValidation(code: string): Promise<UserConfirmationCodeValidateResult | null>
}

export interface IAuthSessionQueryRepository {
    getAll<T>(userId: string, dto: (session: AuthSessionMongoModel[]) => T[]): Promise<T[]>
    getSessionByDeviceId<T>(deviceId: string, dto: (session: AuthSessionMongoModel) => T): Promise<T | null>
    getSessionByUserIdDeviceId<T>(userId: string, deviceId: string, dto: (session: AuthSessionMongoModel) => T): Promise<T | null>
}

export interface IAuthSessionRepository extends IRepository<AuthSessionMongoModel>{
    createSession(input: AuthSessionCreateModel): Promise<string>
    deleteSession(input: AuthSessionRemoveModel): Promise<boolean>
    deleteAllSessions(model: AuthSessionRemoveModel): Promise<boolean>
    getSessionByDeviceId<T>(deviceId: string, dto: (model: AuthSessionMongoModel) => T): Promise<T | null>
}

export interface IBlogsRepository extends IRepository<BlogMongoModel> {
    createBlog<T>(input: BlogCreateModel, dto: (blog: BlogMongoModel) => T): Promise<T>
    updateBlogById(id: string, input: BlogUpdateModel): Promise<boolean>
    deleteBlogById(id: string): Promise<boolean>
}

export interface IBlogsQueryRepository {
    getBlogs<T>(query: WithPaginationQuery<Blog> & {searchNameTerm: string | null}, dto: (blog: BlogMongoModel[]) => T[]): Promise<WithPagination<T>>
    getBlogById<T>(id: string, dto: (post: BlogMongoModel) => T): Promise<T | null>
}

export interface IPostsRepository extends IRepository<PostMongoModel> {
    createPost<T>(input: PostsCreateModel, dto: (post: PostMongoModel) => T): Promise<T>
    updatePostById(id: string, input: PostsUpdateModel): Promise<boolean>
    deletePostById(id: string): Promise<boolean>
}

export interface IPostsQueryRepository {
    getPosts<T>(filter: Partial<PostMongoModel>, query: PostPaginationRepositoryModel, dto: (post: PostMongoModel[]) => T[]): Promise<WithPagination<T>>
    getPostById<T>(id: string, dto: (post: PostMongoModel) => T): Promise<T | null>
}

export interface ICommentsRepository extends IRepository<CommentMongoModel> {
    updateCommentById(id: string, input: CommentUpdateModel): Promise<boolean>
    deleteCommentById(id: string): Promise<boolean>
}

export interface ICommentsQueryRepository {
    isUserCommentOwner(commentId: string, userId: string): Promise<boolean>
    getComments<T>(userId: string | null, filter: Partial<CommentMongoModel>, query: CommentPaginationRepositoryModel, dto: (blog: CommentMongoModel[], userId: string | null) => T[]): Promise<WithPagination<T>>
    getCommentById<T>(id: string, dto: (comment: CommentMongoModel) => T): Promise<T | null>
    getCommentDocById<T>(id: string): Promise<HydratedDocument<CommentMongoModel, ICommentMethods> | null>
}

export interface ILogsRepository {
    clear(): Promise<void>
}

export interface ILogsQueryRepository {
    getAll(): Promise<Log[]>
}
