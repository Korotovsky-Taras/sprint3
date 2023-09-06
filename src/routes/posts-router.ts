import {authBasicValidation} from "../middlewares/auth-basic-validation";
import {PostsRouterController} from "../controllers/PostsRouterController";
import {
    postCreationWithIdValidator,
    postsUpdateLikeStatusValidator,
    postUpdateWithIdValidator
} from "../middlewares/posts-validation";
import {IPostsRouterController, Route, RouterMethod} from "../types";
import {authTokenAccessValidation} from "../middlewares/auth-token-access-validation";
import {commentCreateValidator} from "../middlewares/comments-validation";
import {ioc} from "../ioc.config";


const controller = ioc.resolve<IPostsRouterController>(PostsRouterController);

const postsRoute: Route<IPostsRouterController> = {
    route: "/posts",
    method: RouterMethod.GET,
    controller: controller,
    action: controller.getAll,
    middlewares: [
        authTokenAccessValidation(false)
    ]
}

const postSingleRoute: Route<IPostsRouterController> = {
    route: "/posts/:id",
    method: RouterMethod.GET,
    controller: controller,
    action: controller.getPost,
    middlewares: [
        authTokenAccessValidation(false)
    ]
}

const postSingleUpdateRoute: Route<IPostsRouterController> = {
    route: "/posts/:id",
    method: RouterMethod.PUT,
    controller: controller,
    action: controller.updatePost,
    middlewares: [
        authBasicValidation,
        postUpdateWithIdValidator
    ]
}

const postsCreationRoute: Route<IPostsRouterController> = {
    route: "/posts",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.createPost,
    middlewares: [
        authBasicValidation,
        postCreationWithIdValidator,
    ]
}

const postsDeletingRoute: Route<IPostsRouterController> = {
    route: "/posts/:id",
    method: RouterMethod.DELETE,
    controller: controller,
    action: controller.deletePost,
    middlewares: [
        authBasicValidation,
    ]
}

const postsCommentsRoute: Route<IPostsRouterController> = {
    route: "/posts/:id/comments",
    method: RouterMethod.GET,
    controller: controller,
    action: controller.getComments,
    middlewares: [
        authTokenAccessValidation(false),
    ]
}

const postsCreateCommentRoute: Route<IPostsRouterController> = {
    route: "/posts/:id/comments",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.createComment,
    middlewares: [
        authTokenAccessValidation(true),
        commentCreateValidator
    ]
}

const postsUpdateLikeStatusRoute: Route<IPostsRouterController> = {
    route: "/posts/:id/like-status",
    method: RouterMethod.PUT,
    controller: controller,
    action: controller.updatePostLikeStatus,
    middlewares: [
        authTokenAccessValidation(true),
        postsUpdateLikeStatusValidator
    ]
}

export const postsRoutes: Route<IPostsRouterController>[] = [
    postsRoute,
    postSingleRoute,
    postsCreationRoute,
    postsDeletingRoute,
    postSingleUpdateRoute,
    postsCommentsRoute,
    postsCreateCommentRoute,
    postsUpdateLikeStatusRoute,
];





