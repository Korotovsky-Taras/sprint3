import {WithId} from "mongodb";
import {PaginationQueryModel, WithPaginationQuery} from "./custom";
import {Like, LikeStatus, WithLikes} from "./likes";

export type Comment =  {
    postId: string,
    content: string,
    commentatorInfo: CommentCommentatorInfo,
    likes: Like[];
    createdAt: string
}

export type CommentCommentatorInfo =  {
    userId: string,
    userLogin: string
}

export type CommentMongoModel = WithId<Comment>;

export type CommentCreateRequestModel = Pick<Comment, 'postId' | 'content'> & Pick<CommentCommentatorInfo, "userId" | "userLogin">;

export type CommentCreateInputModel = Pick<Comment, 'postId' | 'content' | 'commentatorInfo'>;

export type CommentUpdateModel = Pick<Comment, 'content'>;

export type CommentLikeStatusInputModel = {
    commentId: string,
    userId: string,
    status: LikeStatus
};

export type CommentLikeStatusUpdateModel = {
    likeStatus: LikeStatus
};

export type CommentViewModel = WithLikes<Pick<Comment, 'content' | 'commentatorInfo' | 'createdAt'> & {id: string }>;

export type CommentPaginationQueryModel = PaginationQueryModel<Comment>;

export type CommentPaginationRepositoryModel = WithPaginationQuery<Comment>;
