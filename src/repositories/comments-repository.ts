import {withMongoLogger} from "../utils/withMongoLogger";
import {commentsCollection} from "../db";
import {
    Comment,
    CommentCreateModel,
    CommentListViewModel,
    CommentMongoModel,
    CommentPaginationRepositoryModel,
    CommentUpdateModel,
    CommentViewModel
} from "../types/comments";
import {CommentsDto} from "../dto/comments.dto";
import {withMongoQueryFilterPagination} from "./utils";
import {ObjectId} from "mongodb";
import {toIsoString} from "../utils/date";

export const commentsRepository = {
    async createComment(input: CommentCreateModel): Promise<CommentViewModel> {
        return withMongoLogger<CommentViewModel>(async () => {
            const newComment: Comment = {
                postId: input.postId,
                content: input.content,
                commentatorInfo: {
                    userId: input.userId,
                    userLogin: input.userLogin,
                },
                createdAt: toIsoString(new Date()),
            }
            const res = await commentsCollection.insertOne(newComment);
            return CommentsDto.comment({
                _id: res.insertedId,
                ...newComment,
            });
        });
    },
    async updateCommentById(id: string, input: CommentUpdateModel): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: input});
            return result.matchedCount === 1;
        })
    },
    async isUserCommentOwner(commentId: string, userId: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result : CommentMongoModel | null = await commentsCollection.findOne({_id: new ObjectId(commentId), "commentatorInfo.userId": userId});
            return !!result;
        })
    },
    async deleteCommentById(id: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await commentsCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        })
    },
    async getCommentById(id: string): Promise<CommentViewModel | null> {
        return withMongoLogger<CommentViewModel | null>(async () => {
            const comment: CommentMongoModel | null = await commentsCollection.findOne({_id: new ObjectId(id)})
            return comment ? CommentsDto.comment(comment) : null;
        })
    },
    async getComments(postId: string, query: CommentPaginationRepositoryModel): Promise<CommentListViewModel> {
        return withMongoLogger<CommentListViewModel>(async () => {
            return withMongoQueryFilterPagination<Comment, CommentViewModel>(commentsCollection, CommentsDto.allComments, {postId}, query)
        })
    },
    async clear(): Promise<void> {
        return withMongoLogger<void>(async () => {
            await commentsCollection.deleteMany({});
        })
    }
}