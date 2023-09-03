import {ICommentsRouterController, Route, RouterMethod} from "../types";
import {commentsRouterController} from "../controllers/CommentsRouterController";
import {authTokenAccessValidation} from "../middlewares/auth-token-access-validation";
import {commentUpdateLikeStatusValidator, commentUpdateValidator} from "../middlewares/comments-validation";


export const commentSingleRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id",
    method: RouterMethod.GET,
    controller: commentsRouterController,
    action: commentsRouterController.getComment,
    middlewares: [
        authTokenAccessValidation(false)
    ]
}

export const deleteSingleRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id",
    method: RouterMethod.DELETE,
    controller: commentsRouterController,
    action: commentsRouterController.deleteComment,
    middlewares: [
        authTokenAccessValidation(true)
    ]
}

export const updateSingleRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id",
    method: RouterMethod.PUT,
    controller: commentsRouterController,
    action: commentsRouterController.updateComment,
    middlewares: [
        authTokenAccessValidation(true),
        commentUpdateValidator
    ]
}

export const updateLikeStatusRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id/like-status",
    method: RouterMethod.PUT,
    controller: commentsRouterController,
    action: commentsRouterController.updateCommentLikeStatus,
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