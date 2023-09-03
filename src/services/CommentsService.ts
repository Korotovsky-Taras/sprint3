import {ICommentsService, PostsCommentCreateModel, PostViewModel, Status, UserViewModel} from "../types";
import {CommentMongoModel, CommentUpdateModel, CommentViewModel} from "../types/comments";
import {CommentsDto} from "../dto/comments.dto";
import {UsersDto} from "../dto/users.dto";
import {PostsDto} from "../dto/posts.dto";
import {HydratedDocument} from "mongoose";
import {CommentModel} from "../repositories/models/Comment";
import {
    ICommentsQueryRepository,
    ICommentsRepository,
    IPostsQueryRepository,
    IUsersQueryRepository,
} from "../types/repository";
import {commentsQueryRepository, commentsRepository, postsQueryRepository, usersQueryRepository} from "../repositories";

class CommentsService implements ICommentsService {

    constructor(
        private readonly commentsRepo: ICommentsRepository,
        private readonly commentsQueryRepo: ICommentsQueryRepository,
        private readonly usersQueryRepo: IUsersQueryRepository,
        private readonly postsQueryRepo: IPostsQueryRepository,
    ) {
    }

    async updateCommentById(commentId: string, userId: string | null, model: CommentUpdateModel): Promise<Status> {
        const comment: CommentViewModel | null = await this.commentsQueryRepo.getCommentById(commentId, CommentsDto.comment)

        if (!comment || !userId) {
            return Status.NOT_FOUND;
        }

        const isUserCommentOwner: boolean = await this.commentsQueryRepo.isUserCommentOwner(commentId, userId);

        if (!isUserCommentOwner) {
            return Status.FORBIDDEN;
        }

        const isUpdated: boolean = await this.commentsRepo.updateCommentById(commentId, model);

        if (isUpdated) {
            return Status.NO_CONTENT;
        }

        return Status.NOT_FOUND;
    }

    async deleteCommentById(commentId: string, userId: string | null): Promise<Status> {
        const comment: CommentViewModel | null = await this.commentsQueryRepo.getCommentById(commentId, CommentsDto.comment)

        if (!comment || !userId) {
            return Status.NOT_FOUND;
        }

        const isUserCommentOwner: boolean = await this.commentsQueryRepo.isUserCommentOwner(commentId, userId);

        if (!isUserCommentOwner) {
            return Status.FORBIDDEN;
        }

        const isDeleted: boolean = await this.commentsRepo.deleteCommentById(commentId);

        if (isDeleted) {
            return Status.NO_CONTENT;
        }

        return Status.NOT_FOUND;
    }

    async createComment<T>(postId: string, userId: string, model: PostsCommentCreateModel, dto: (from: CommentMongoModel) => T): Promise<T | null> {
        const user: UserViewModel | null = await this.usersQueryRepo.getUserById(userId, UsersDto.user);
        const post: PostViewModel | null = await this.postsQueryRepo.getPostById(postId, PostsDto.post);
        if (user && post) {
            const comment: HydratedDocument<CommentMongoModel> = CommentModel.createComment({
                postId: post.id,
                content: model.content,
                commentatorInfo: {
                    userId: user.id,
                    userLogin: user.login
                }
            });
            await this.commentsRepo.saveDoc(comment);
            return dto(comment);
        }
        return null;
    }
}


export const commentsService = new CommentsService(commentsRepository, commentsQueryRepository, usersQueryRepository, postsQueryRepository);