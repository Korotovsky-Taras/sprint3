import {blogsRouterController} from "../controllers/BlogsRouterController";
import {authBasicValidation} from "../middlewares/auth-basic-validation";
import {blogsCreationValidator} from "../middlewares/blogs-validation";
import {IBlogsRouterController, Route, RouterMethod} from "../types";
import {postCreationValidator} from "../middlewares/posts-validation";


export const blogsRoute: Route<IBlogsRouterController> = {
    route: "/blogs",
    method: RouterMethod.GET,
    controller: blogsRouterController,
    action: blogsRouterController.getAll,
}

const blogSingleRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id",
    method: RouterMethod.GET,
    controller: blogsRouterController,
    action: blogsRouterController.getBlog,
}

const blogPostsRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id/posts",
    method: RouterMethod.GET,
    controller: blogsRouterController,
    action: blogsRouterController.getBlogPosts,
}

const blogPostCreationRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id/posts",
    method: RouterMethod.POST,
    controller: blogsRouterController,
    action: blogsRouterController.createBlogPost,
    middlewares: [
        authBasicValidation,
        postCreationValidator
    ]
}

const blogSingleUpdateRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id",
    method: RouterMethod.PUT,
    controller: blogsRouterController,
    action: blogsRouterController.updateBlog,
    middlewares: [
        authBasicValidation,
        blogsCreationValidator
    ]
}

const blogsCreationRoute: Route<IBlogsRouterController> = {
    route: "/blogs",
    method: RouterMethod.POST,
    controller: blogsRouterController,
    action: blogsRouterController.createBlog,
    middlewares: [
        authBasicValidation,
        blogsCreationValidator
    ]
}

const blogsDeletingRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id",
    method: RouterMethod.DELETE,
    controller: blogsRouterController,
    action: blogsRouterController.deleteBlog,
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





