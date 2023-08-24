import {blogsRouterController} from "../controllers/BlogsRouterController";
import {authBasicValidation} from "../middlewares/auth-basic-validation";
import {blogsCreationValidator} from "../middlewares/blogs-validation";
import {IBlogsRouterController, Route, RouterMethod} from "../types";
import {postCreationValidator} from "../middlewares/posts-validation";


export const blogsRoute: Route<IBlogsRouterController> = {
    route: "/blogs",
    method: RouterMethod.GET,
    controller: blogsRouterController,
    action: 'getAll',
}

const blogSingleRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id",
    method: RouterMethod.GET,
    controller: blogsRouterController,
    action: 'getBlog',
}

const blogPostsRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id/posts",
    method: RouterMethod.GET,
    controller: blogsRouterController,
    action: 'getBlogPosts',
}

const blogPostCreationRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id/posts",
    method: RouterMethod.POST,
    controller: blogsRouterController,
    action: 'createBlogPost',
    middlewares: [
        authBasicValidation,
        postCreationValidator
    ]
}

const blogSingleUpdateRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id",
    method: RouterMethod.PUT,
    controller: blogsRouterController,
    action: 'updateBlog',
    middlewares: [
        authBasicValidation,
        blogsCreationValidator
    ]
}

const blogsCreationRoute: Route<IBlogsRouterController> = {
    route: "/blogs",
    method: RouterMethod.POST,
    controller: blogsRouterController,
    action: 'createBlog',
    middlewares: [
        authBasicValidation,
        blogsCreationValidator
    ]
}

const blogsDeletingRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id",
    method: RouterMethod.DELETE,
    controller: blogsRouterController,
    action: 'deleteBlog',
    middlewares: [
        authBasicValidation,
    ]
}

export const blogRoutes: Route<IBlogsRouterController>[] = [
    blogsRoute,
    blogSingleRoute,
    blogPostsRoute,
    blogPostCreationRoute,
    blogsCreationRoute,
    blogsDeletingRoute,
    blogSingleUpdateRoute,
];





