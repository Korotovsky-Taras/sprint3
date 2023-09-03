import {BlogCreateModel, BlogPostCreateModel, BlogUpdateModel, BlogViewModel} from "./blogs";
import {PostsCommentCreateModel, PostsCreateModel, PostsUpdateModel, PostViewModel} from "./posts";
import {UserCreateRequestModel, UserViewModel} from "./users";
import {
    AuthLoginRepoModel,
    AuthLogoutRepoModel,
    AuthNewPasswordCreationModel,
    AuthRefreshTokenRepoModel,
    AuthRegisterConfirmationModel,
    AuthRegisterModel,
    AuthResendingEmailModel,
    AuthServiceResultModel,
    AuthTokens
} from "./login";
import {CommentMongoModel, CommentUpdateModel} from "./comments";
import {Status} from "./custom";

export interface IService {

}

export interface IBlogService extends IService {
    createBlog(model: BlogCreateModel): Promise<BlogViewModel>
    createPost(blogId: string, model: BlogPostCreateModel): Promise<PostViewModel | null>
    updateBlogById(blogId: string, model: BlogUpdateModel): Promise<boolean>
    deleteBlogById(blogId: string): Promise<boolean>
}

export interface IPostsService extends IService {
    createPost(model: PostsCreateModel): Promise<PostViewModel | null>
    updatePostById(blogId: string, model: PostsUpdateModel): Promise<boolean>
    deletePostById(blogId: string): Promise<boolean>
}

export interface IUsersService extends IService {
    createUser(model: UserCreateRequestModel): Promise<UserViewModel | null>
    deleteUser(blogId: string): Promise<boolean>
    login(model: AuthLoginRepoModel): Promise<AuthTokens | null>
    logout(model: AuthLogoutRepoModel): Promise<boolean>
    refreshTokens(model: AuthRefreshTokenRepoModel): Promise<AuthTokens | null>
    registerUser(model: AuthRegisterModel): Promise<AuthServiceResultModel>
    verifyConfirmationCode(model: AuthRegisterConfirmationModel): Promise<AuthServiceResultModel>
    tryResendConfirmationCode(model: AuthResendingEmailModel): Promise<void>
    tryResendPasswordRecoverCode(model: AuthResendingEmailModel): Promise<void>
    recoverPasswordWithConfirmationCode(model: AuthNewPasswordCreationModel): Promise<boolean>
}

export interface ICommentsService extends IService {
    updateCommentById(commentId: string, userId: string | null, model: CommentUpdateModel): Promise<Status>
    deleteCommentById(commentId: string, userId: string | null ): Promise<Status>
    createComment<T>(postId: string, userId: string, model: PostsCommentCreateModel, dto: (from: CommentMongoModel) => T): Promise<T | null>
}
