import {
    ICommentsRouterController,
    ICommentsService,
    ParamIdModel,
    RequestWithParams,
    RequestWithParamsBody,
    Status
} from "../types";
import {NextFunction, Response} from "express";
import {CommentLikeStatusUpdateModel, CommentMongoModel, CommentUpdateModel, CommentViewModel} from "../types/comments";
import {CommentsDto} from "../dto/comments.dto";
import {commentsService} from "../services/CommentsService";
import {ICommentsQueryRepository} from "../types/repository";
import {commentsQueryRepository} from "../repositories";
import {HydratedDocument} from "mongoose";


class CommentsRouterController implements ICommentsRouterController {

    constructor(
        private readonly commentsService: ICommentsService,
        private readonly commentsQueryRepository: ICommentsQueryRepository,
    ) {
    }

    async getComment(req: RequestWithParams<ParamIdModel>, res: Response<CommentViewModel>, next: NextFunction) {
        const comment: HydratedDocument<CommentMongoModel> | null = await this.commentsQueryRepository.getCommentDocById(req.params.id);
        if (comment) {
            return res.status(Status.OK).send(CommentsDto.comment(comment, req.userId));
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    //TODO избавиться от статусов из сервиса
    async updateComment(req: RequestWithParamsBody<ParamIdModel, CommentUpdateModel>, res: Response) {
        const status: Status = await this.commentsService.updateCommentById(req.params.id, req.userId, req.body);
        return res.sendStatus(status);
    }

    async updateCommentLikeStatus(req: RequestWithParamsBody<ParamIdModel, CommentLikeStatusUpdateModel>, res: Response) {
        if (req.userId) {

            const isUpdated: boolean = await this.commentsService.updateLikeStatus({
                commentId: req.params.id,
                userId: req.userId,
                status: req.body.likeStatus
            });

            if (isUpdated) {
                return res.sendStatus(Status.NO_CONTENT);
            }
            return res.sendStatus(Status.NOT_FOUND);
        }
        return res.sendStatus(Status.UNATHORIZED);
    }

    async deleteComment(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        const status: Status = await this.commentsService.deleteCommentById(req.params.id, req.userId);
        return res.sendStatus(status);
    }
}

export const commentsRouterController = new CommentsRouterController(commentsService, commentsQueryRepository);