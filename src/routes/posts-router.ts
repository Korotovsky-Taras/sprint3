import {authBasicValidation} from "../middlewares/auth-basic-validation";
import {postsRouterController} from "../controllers/PostsRouterController";
import {postCreationWithIdValidator, postUpdateWithIdValidator} from "../middlewares/posts-validation";
import {IPostsRouterController, Route, RouterMethod} from "../types";
import {authTokenAccessValidation} from "../middlewares/auth-token-access-validation";
import {commentCreateValidator} from "../middlewares/comments-validation";


const postsRoute: Route<IPostsRouterController> = {
    route: "/posts",
    method: RouterMethod.GET,
    controller: postsRouterController,
    action: 'getAll',
}

const postSingleRoute: Route<IPostsRouterController> = {
    route: "/posts/:id",
    method: RouterMethod.GET,
    controller: postsRouterController,
    action: 'getPost',
}

const postSingleUpdateRoute: Route<IPostsRouterController> = {
    route: "/posts/:id",
    method: RouterMethod.PUT,
    controller: postsRouterController,
    action: 'updatePost',
    middlewares: [
        authBasicValidation,
        postUpdateWithIdValidator
    ]
}

const postsCreationRoute: Route<IPostsRouterController> = {
    route: "/posts",
    method: RouterMethod.POST,
    controller: postsRouterController,
    action: 'createPost',
    middlewares: [
        authBasicValidation,
        postCreationWithIdValidator,
    ]
}

const postsDeletingRoute: Route<IPostsRouterController> = {
    route: "/posts/:id",
    method: RouterMethod.DELETE,
    controller: postsRouterController,
    action: 'deletePost',
    middlewares: [
        authBasicValidation,
    ]
}

const postsCommentsRoute: Route<IPostsRouterController> = {
    route: "/posts/:id/comments",
    method: RouterMethod.GET,
    controller: postsRouterController,
    action: 'getComments'
}

const postsCreateCommentRoute: Route<IPostsRouterController> = {
    route: "/posts/:id/comments",
    method: RouterMethod.POST,
    controller: postsRouterController,
    action: 'createComment',
    middlewares: [
        authTokenAccessValidation,
        commentCreateValidator
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
];





