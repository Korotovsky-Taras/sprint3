import {ICommentsService, PostsCommentCreateModel, PostViewModel, Status} from "../types";
import {postsRepository} from "../repositories";
import {CommentUpdateModel, CommentViewModel} from "../types/comments";
import {usersRepository} from "../repositories/users-repository";
import {AuthMeViewModel} from "../types/login";
import {commentsRepository} from "../repositories/comments-repository";

class CommentsService implements ICommentsService {
    async updateCommentById(commentId: string, userId: string | null, model: CommentUpdateModel): Promise<Status> {
        const comment: CommentViewModel | null = await commentsRepository.getCommentById(commentId)

        if (!comment || !userId) {
            return Status.NOT_FOUND;
        }

        const isUserCommentOwner: boolean = await commentsRepository.isUserCommentOwner(commentId, userId);

        if (!isUserCommentOwner) {
            return Status.FORBIDDEN;
        }

        const isUpdated: boolean = await commentsRepository.updateCommentById(commentId, model);

        if (isUpdated) {
            return Status.NO_CONTENT;
        }

        return Status.NOT_FOUND;
    }

    async deleteCommentById(commentId: string, userId: string | null): Promise<Status> {
        const comment: CommentViewModel | null = await commentsRepository.getCommentById(commentId)

        if (!comment || !userId) {
            return Status.NOT_FOUND;
        }

        const isUserCommentOwner: boolean = await commentsRepository.isUserCommentOwner(commentId, userId);

        if (!isUserCommentOwner) {
            return Status.FORBIDDEN;
        }

        const isDeleted: boolean = await commentsRepository.deleteCommentById(commentId);

        if (isDeleted) {
            return Status.NO_CONTENT;
        }

        return Status.NOT_FOUND;
    }
    async createComment(postId: string, userId: string, model: PostsCommentCreateModel): Promise<CommentViewModel | null> {
        const user: AuthMeViewModel | null = await usersRepository.getAuthUserById(userId);
        const post: PostViewModel | null = await postsRepository.findPostById(postId);
        if (user && post) {
            return commentsRepository.createComment({
                postId,
                userLogin: user.login,
                userId: user.userId,
                content: model.content
            });
        }
        return null;
    }
}

export const commentsService = new CommentsService();
