import {NextFunction, Request, Response} from "express";
import {IService} from "./services";

export class BaseController<T extends IService> {
    constructor(public service: T) {}
}

export interface IBlogsRouterController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
    createBlog(req: Request, res: Response, next: NextFunction): Promise<Response>,
    createBlogPost(req: Request, res: Response, next: NextFunction): Promise<Response>,
    getBlog(req: Request, res: Response, next: NextFunction): Promise<Response>,
    getBlogPosts(req: Request, res: Response, next: NextFunction): Promise<Response>,
    updateBlog(req: Request, res: Response, next: NextFunction): Promise<Response>,
    deleteBlog(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

export interface ITestingRouterController {
    clearAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

export interface IPostsRouterController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
    createPost(req: Request, res: Response, next: NextFunction): Promise<Response>,
    getPost(req: Request, res: Response, next: NextFunction): Promise<Response>,
    updatePost(req: Request, res: Response, next: NextFunction): Promise<Response>,
    deletePost(req: Request, res: Response, next: NextFunction): Promise<Response>,
    createComment(req: Request, res: Response, next: NextFunction): Promise<Response>,
    getComments(req: Request, res: Response, next: NextFunction): Promise<Response>,
    updatePostLikeStatus(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

export interface ILogsRouterController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
    deleteAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

export interface IAuthRouterController {
    logout(req: Request, res: Response, next: NextFunction): Promise<Response>,
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response>,
    login(req: Request, res: Response, next: NextFunction): Promise<Response>,
    registration(req: Request, res: Response, next: NextFunction): Promise<Response>,
    registrationConfirmation(req: Request, res: Response, next: NextFunction): Promise<Response>,
    registrationEmailResending(req: Request, res: Response, next: NextFunction): Promise<Response>,
    passwordRecovery(req: Request, res: Response, next: NextFunction): Promise<Response>,
    recoverPasswordWithConfirmationCode(req: Request, res: Response, next: NextFunction): Promise<Response>,
    me(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

export interface ISecurityRouterController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
    deleteAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
    deleteDevice(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

export interface IUsersRouterController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
    createUser(req: Request, res: Response, next: NextFunction): Promise<Response>,
    deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

export interface ICommentsRouterController {
    getComment(req: Request, res: Response, next: NextFunction): Promise<Response>,
    updateComment(req: Request, res: Response, next: NextFunction): Promise<Response>,
    updateCommentLikeStatus(req: Request, res: Response, next: NextFunction): Promise<Response>,
    deleteComment(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

