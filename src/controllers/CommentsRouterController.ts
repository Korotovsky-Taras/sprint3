import {
    ICommentsRouterController,
    ICommentsService,
    ParamIdModel,
    RequestWithParams,
    RequestWithParamsBody,
    Status
} from "../types";
import {NextFunction, Response} from "express";
import {CommentUpdateModel, CommentViewModel} from "../types/comments";
import {CommentsDto} from "../dto/comments.dto";
import {commentsService} from "../services/CommentsService";
import {ICommentsQueryRepository} from "../types/repository";
import {commentsQueryRepository} from "../repositories";


class CommentsRouterController implements ICommentsRouterController {

    constructor(
        private readonly commentsService: ICommentsService,
        private readonly commentsQueryRepository: ICommentsQueryRepository,
    ) {
    }

    async getComment(req: RequestWithParams<ParamIdModel>, res: Response<CommentViewModel>, next: NextFunction) {
        const comment: CommentViewModel | null = await this.commentsQueryRepository.getCommentById(req.params.id, CommentsDto.comment);
        if (comment) {
            return res.status(Status.OK).send(comment);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async updateComment(req: RequestWithParamsBody<ParamIdModel, CommentUpdateModel>, res: Response) {
        const status: Status = await this.commentsService.updateCommentById(req.params.id, req.userId, req.body);
        return res.sendStatus(status);
    }

    async deleteComment(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        const status: Status = await this.commentsService.deleteCommentById(req.params.id, req.userId);
        return res.sendStatus(status);
    }
}

export const commentsRouterController = new CommentsRouterController(commentsService, commentsQueryRepository);