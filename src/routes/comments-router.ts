import {ICommentsRouterController, Route, RouterMethod} from "../types";
import {commentsRouterController} from "../controllers/CommentsRouterController";
import {authTokenAccessValidation} from "../middlewares/auth-token-access-validation";
import {commentUpdateValidator} from "../middlewares/comments-validation";


export const commentSingleRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id",
    method: RouterMethod.GET,
    controller: commentsRouterController,
    action: commentsRouterController.getComment,
}

export const deleteSingleRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id",
    method: RouterMethod.DELETE,
    controller: commentsRouterController,
    action: commentsRouterController.deleteComment,
    middlewares: [
        authTokenAccessValidation
    ]
}

export const updateSingleRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id",
    method: RouterMethod.PUT,
    controller: commentsRouterController,
    action: commentsRouterController.updateComment,
    middlewares: [
        authTokenAccessValidation,
        commentUpdateValidator
    ]
}

export const commentsRoutes: Route<ICommentsRouterController>[] = [
    commentSingleRoute,
    deleteSingleRoute,
    updateSingleRoute,
];