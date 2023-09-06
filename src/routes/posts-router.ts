import {authBasicValidation} from "../middlewares/auth-basic-validation";
import {postsRouterController} from "../controllers/PostsRouterController";
import {
    postCreationWithIdValidator,
    postsUpdateLikeStatusValidator,
    postUpdateWithIdValidator
} from "../middlewares/posts-validation";
import {IPostsRouterController, Route, RouterMethod} from "../types";
import {authTokenAccessValidation} from "../middlewares/auth-token-access-validation";
import {commentCreateValidator} from "../middlewares/comments-validation";


const postsRoute: Route<IPostsRouterController> = {
    route: "/posts",
    method: RouterMethod.GET,
    controller: postsRouterController,
    action: postsRouterController.getAll,
    middlewares: [
        authTokenAccessValidation(false)
    ]
}

const postSingleRoute: Route<IPostsRouterController> = {
    route: "/posts/:id",
    method: RouterMethod.GET,
    controller: postsRouterController,
    action: postsRouterController.getPost,
    middlewares: [
        authTokenAccessValidation(false)
    ]
}

const postSingleUpdateRoute: Route<IPostsRouterController> = {
    route: "/posts/:id",
    method: RouterMethod.PUT,
    controller: postsRouterController,
    action: postsRouterController.updatePost,
    middlewares: [
        authBasicValidation,
        postUpdateWithIdValidator
    ]
}

const postsCreationRoute: Route<IPostsRouterController> = {
    route: "/posts",
    method: RouterMethod.POST,
    controller: postsRouterController,
    action: postsRouterController.createPost,
    middlewares: [
        authBasicValidation,
        postCreationWithIdValidator,
    ]
}

const postsDeletingRoute: Route<IPostsRouterController> = {
    route: "/posts/:id",
    method: RouterMethod.DELETE,
    controller: postsRouterController,
    action: postsRouterController.deletePost,
    middlewares: [
        authBasicValidation,
    ]
}

const postsCommentsRoute: Route<IPostsRouterController> = {
    route: "/posts/:id/comments",
    method: RouterMethod.GET,
    controller: postsRouterController,
    action: postsRouterController.getComments,
    middlewares: [
        authTokenAccessValidation(false),
    ]
}

const postsCreateCommentRoute: Route<IPostsRouterController> = {
    route: "/posts/:id/comments",
    method: RouterMethod.POST,
    controller: postsRouterController,
    action: postsRouterController.createComment,
    middlewares: [
        authTokenAccessValidation(true),
        commentCreateValidator
    ]
}

const postsUpdateLikeStatusRoute: Route<IPostsRouterController> = {
    route: "/posts/:id/like-status",
    method: RouterMethod.PUT,
    controller: postsRouterController,
    action: postsRouterController.updatePostLikeStatus,
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





