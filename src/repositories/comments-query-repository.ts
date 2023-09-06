import {CommentMongoModel, CommentPaginationRepositoryModel} from "../types/comments";
import {ObjectId} from "mongodb";
import {ICommentsQueryRepository} from "../types/repository";
import {CommentModel, ICommentMethods} from "./models/Comment";
import {withModelPagination} from "./utils/withModelPagination";
import {WithPagination} from "../types";
import {HydratedDocument} from "mongoose";

class CommentsQueryRepository implements ICommentsQueryRepository {
    async getComments<T>(userId: string | null, filter: Partial<CommentMongoModel>, query: CommentPaginationRepositoryModel, dto: (blog: CommentMongoModel[], userId: string | null) => T[]): Promise<WithPagination<T>> {
        return withModelPagination<CommentMongoModel, T>(CommentModel, filter, query, (items) => {
            return dto(items, userId)
        });
    }
    async isUserCommentOwner(commentId: string, userId: string): Promise<boolean> {
        const query = CommentModel.where({_id: new ObjectId(commentId)}).where({"commentatorInfo.userId": userId})
        const res : CommentMongoModel | null = await query.findOne().lean<CommentMongoModel>() as CommentMongoModel;
        return !!res;
    }
    async getCommentById<T>(userId: string | null, id: string, dto: (comment: CommentMongoModel, userId: string | null) => T): Promise<T | null> {
        const comment: HydratedDocument<CommentMongoModel>| null = await CommentModel.findOne({_id: new ObjectId(id)}).exec()
        if (comment) {
            return dto(comment, userId);
        }
        return null;
    }
    async isCommentExist(id: string): Promise<boolean> {
        const comment: HydratedDocument<CommentMongoModel, ICommentMethods>| null = await CommentModel.findOne({_id: new ObjectId(id)}).exec()
        return !!comment;
    }
}

export const commentsQueryRepository = new CommentsQueryRepository();