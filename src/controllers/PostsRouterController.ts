import {NextFunction, Response} from "express";
import {
    ICommentsService,
    IPostsRouterController,
    IPostsService,
    PaginationQueryModel,
    ParamIdModel,
    Post,
    PostsCommentCreateModel,
    PostsCreateModel,
    PostsUpdateModel,
    PostViewModel,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithParamsQuery,
    RequestWithQuery,
    Status,
    WithPagination
} from "../types";
import {PostsDto} from "../dto/posts.dto";
import {Comment, CommentPaginationRepositoryModel, CommentViewModel} from "../types/comments";
import {CommentsDto} from "../dto/comments.dto";
import {commentsService} from "../services/CommentsService";
import {postsService} from "../services/PostsService";
import {ICommentsQueryRepository, IPostsQueryRepository, IUsersQueryRepository} from "../types/repository";
import {commentsQueryRepository, postsQueryRepository, usersQueryRepository} from "../repositories";
import {LikeStatusUpdateModel} from "../types/likes";


class PostsRouterController implements IPostsRouterController {

    constructor(
        private readonly postsService: IPostsService,
        private readonly commentsService: ICommentsService,
        private readonly commentsQueryRepo: ICommentsQueryRepository,
        private readonly postsQueryRepository: IPostsQueryRepository,
        private readonly usersQueryRepo: IUsersQueryRepository,
    ) {
    }

    async getAll(req: RequestWithQuery<PaginationQueryModel<Post>>, res: Response<WithPagination<PostViewModel>>, next: NextFunction) {
        const posts: WithPagination<PostViewModel> = await this.postsQueryRepository.getPosts(req.userId, {}, PostsDto.toRepoQuery(req.query), PostsDto.allPosts);
        return res.status(Status.OK).send(posts);
    }

    async getPost(req: RequestWithParamsBody<ParamIdModel, PostsCreateModel>, res: Response<PostViewModel | null>, next: NextFunction) {
        const post: PostViewModel | null = await this.postsQueryRepository.getPostById(req.userId, req.params.id, PostsDto.post);
        if (post) {
            return res.status(Status.OK).send(post);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async createPost(req: RequestWithBody<PostsCreateModel>, res: Response<PostViewModel>, next: NextFunction) {
        const post: PostViewModel | null = await this.postsService.createPost(req.userId, req.body);
        if (post) {
            return res.status(Status.CREATED).send(post);
        }
        return res.sendStatus(Status.BAD_REQUEST);
    }

    async updatePost(req: RequestWithParamsBody<ParamIdModel, PostsUpdateModel>, res: Response, next: NextFunction) {
        const post = await this.postsService.updatePostById(req.params.id, req.body);
        if (post) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async deletePost(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        const isDeleted = await this.postsService.deletePostById(req.params.id);
        if (isDeleted) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async getComments(req: RequestWithParamsQuery<ParamIdModel, PaginationQueryModel<Comment>>, res: Response<WithPagination<CommentViewModel>>) {
        const query: CommentPaginationRepositoryModel = CommentsDto.toRepoQuery(req.query);
        const post: boolean = await this.postsQueryRepository.isPostExist(req.params.id);
        if (post) {
            const comments: WithPagination<CommentViewModel> = await this.commentsQueryRepo.getComments(req.userId, {postId: req.params.id}, query, CommentsDto.allComments);
            return res.status(Status.OK).send(comments);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async createComment(req: RequestWithParamsBody<ParamIdModel, PostsCommentCreateModel>, res: Response<CommentViewModel>) {
        if (req.userId) {
            const comment: CommentViewModel | null = await this.commentsService.createComment(req.params.id, req.userId, req.body, CommentsDto.comment);
            if (comment) {
                return res.status(Status.CREATED).send(comment);
            }
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async updatePostLikeStatus(req: RequestWithParamsBody<ParamIdModel, LikeStatusUpdateModel>, res: Response<CommentViewModel>) {
        if (req.userId) {

            const userExist: boolean = await this.usersQueryRepo.isUserExist(req.userId);

            if (!userExist) {
                return res.sendStatus(Status.UNATHORIZED);
            }

            const isUpdated: boolean = await this.postsService.updateLikeStatus({
                postId: req.params.id,
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
}

export const postsRouterController = new PostsRouterController(postsService, commentsService, commentsQueryRepository, postsQueryRepository, usersQueryRepository);