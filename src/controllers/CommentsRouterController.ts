import {ICommentsRouterController, ParamIdModel, RequestWithParams, RequestWithParamsBody, Status} from "../types";
import {NextFunction, Response} from "express";
import {commentsRepository} from "../repositories/comments-repository";
import {CommentUpdateModel, CommentViewModel} from "../types/comments";
import {commentsService} from "../services/CommentsService";


class CommentsRouterController implements ICommentsRouterController {

    async getComment(req: RequestWithParams<ParamIdModel>, res: Response<CommentViewModel>, next: NextFunction) {
        const comment : CommentViewModel | null = await commentsRepository.getCommentById(req.params.id);
        if (comment) {
            return res.status(Status.OK).send(comment);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
    async updateComment(req: RequestWithParamsBody<ParamIdModel, CommentUpdateModel>, res: Response) {
        const status: Status = await commentsService.updateCommentById(req.params.id, req.userId, req.body);
        return res.sendStatus(status);
    }
    async deleteComment(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        const status: Status = await commentsService.deleteCommentById(req.params.id, req.userId);
        return res.sendStatus(status);
    }
}

export const commentsRouterController = new CommentsRouterController();