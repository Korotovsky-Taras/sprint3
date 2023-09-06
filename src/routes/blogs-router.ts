import {BlogsRouterController} from "../controllers/BlogsRouterController";
import {authBasicValidation} from "../middlewares/auth-basic-validation";
import {blogsCreationValidator} from "../middlewares/blogs-validation";
import {IBlogsRouterController, Route, RouterMethod} from "../types";
import {postCreationValidator} from "../middlewares/posts-validation";
import {authTokenAccessValidation} from "../middlewares/auth-token-access-validation";
import {ioc} from "../ioc.config";

const controller = ioc.resolve<IBlogsRouterController>(BlogsRouterController);

export const blogsRoute: Route<IBlogsRouterController> = {
    route: "/blogs",
    method: RouterMethod.GET,
    controller: controller,
    action: controller.getAll,
}

const blogSingleRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id",
    method: RouterMethod.GET,
    controller: controller,
    action: controller.getBlog,
}

const blogPostsRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id/posts",
    method: RouterMethod.GET,
    controller: controller,
    action: controller.getBlogPosts,
    middlewares: [
        authTokenAccessValidation(false)
    ]
}

const blogPostCreationRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id/posts",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.createBlogPost,
    middlewares: [
        authBasicValidation,
        postCreationValidator
    ]
}

const blogSingleUpdateRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id",
    method: RouterMethod.PUT,
    controller: controller,
    action: controller.updateBlog,
    middlewares: [
        authBasicValidation,
        blogsCreationValidator
    ]
}

const blogsCreationRoute: Route<IBlogsRouterController> = {
    route: "/blogs",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.createBlog,
    middlewares: [
        authBasicValidation,
        blogsCreationValidator
    ]
}

const blogsDeletingRoute: Route<IBlogsRouterController> = {
    route: "/blogs/:id",
    method: RouterMethod.DELETE,
    controller: controller,
    action: controller.deleteBlog,
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





