import {ICommentsRouterController, Route, RouterMethod} from "../types";
import {CommentsRouterController} from "../controllers/CommentsRouterController";
import {authTokenAccessValidation} from "../middlewares/auth-token-access-validation";
import {commentUpdateLikeStatusValidator, commentUpdateValidator} from "../middlewares/comments-validation";
import {ioc} from "../ioc.config";

const controller = ioc.resolve<ICommentsRouterController>(CommentsRouterController);

const commentSingleRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id",
    method: RouterMethod.GET,
    controller: controller,
    action: controller.getComment,
    middlewares: [
        authTokenAccessValidation(false)
    ]
}

const deleteSingleRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id",
    method: RouterMethod.DELETE,
    controller: controller,
    action: controller.deleteComment,
    middlewares: [
        authTokenAccessValidation(true)
    ]
}

const updateSingleRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id",
    method: RouterMethod.PUT,
    controller: controller,
    action: controller.updateComment,
    middlewares: [
        authTokenAccessValidation(true),
        commentUpdateValidator
    ]
}

const updateLikeStatusRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id/like-status",
    method: RouterMethod.PUT,
    controller: controller,
    action: controller.updateCommentLikeStatus,
    middlewares: [
        authTokenAccessValidation(true),
        commentUpdateLikeStatusValidator
    ]
}

export const commentsRoutes: Route<ICommentsRouterController>[] = [
    commentSingleRoute,
    deleteSingleRoute,
    updateSingleRoute,
    updateLikeStatusRoute
];