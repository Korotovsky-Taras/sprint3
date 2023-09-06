import {ICommentsRouterController, ParamIdModel, RequestWithParams, RequestWithParamsBody, Status} from "../types";
import {NextFunction, Response} from "express";
import {CommentUpdateModel, CommentViewModel} from "../types/comments";
import {CommentsDto} from "../dto/comments.dto";
import {LikeStatusUpdateModel} from "../types/likes";
import {injectable} from "inversify";
import {CommentsService} from "../services/CommentsService";
import {CommentsQueryRepository} from "../repositories/comments-query-repository";
import {UsersQueryRepository} from "../repositories/users-query-repository";

@injectable()
export class CommentsRouterController implements ICommentsRouterController {

    constructor(
        private readonly commentsService: CommentsService,
        private readonly commentsQueryRepository: CommentsQueryRepository,
        private readonly usersQueryRepo: UsersQueryRepository,
    ) {
    }

    async getComment(req: RequestWithParams<ParamIdModel>, res: Response<CommentViewModel>, next: NextFunction) {
        const comment: CommentViewModel | null = await this.commentsQueryRepository.getCommentById(req.userId, req.params.id, CommentsDto.comment);
        if (comment) {
            return res.status(Status.OK).send(comment);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    //TODO избавиться от статусов из сервиса
    async updateComment(req: RequestWithParamsBody<ParamIdModel, CommentUpdateModel>, res: Response) {
        const status: Status = await this.commentsService.updateCommentById(req.params.id, req.userId, req.body);
        return res.sendStatus(status);
    }

    async updateCommentLikeStatus(req: RequestWithParamsBody<ParamIdModel, LikeStatusUpdateModel>, res: Response) {
        if (req.userId) {

            const userExist: boolean = await this.usersQueryRepo.isUserExist(req.userId);

            if (!userExist) {
                return res.sendStatus(Status.UNATHORIZED);
            }

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
