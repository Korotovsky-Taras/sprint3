import {CommentMongoModel, CommentPaginationRepositoryModel} from "../types/comments";
import {ObjectId} from "mongodb";
import {ICommentsQueryRepository} from "../types/repository";
import {CommentModel} from "./models/Comment";
import {withModelPagination} from "./utils/withModelPagination";
import {WithPagination} from "../types";

class CommentsQueryRepository implements ICommentsQueryRepository {
    async getComments<T>(filter: Partial<CommentMongoModel>, query: CommentPaginationRepositoryModel, dto: (blog: CommentMongoModel[]) => T[]): Promise<WithPagination<T>> {
        return withModelPagination<CommentMongoModel, T>(CommentModel, filter, query, dto);
    }
    async isUserCommentOwner(commentId: string, userId: string): Promise<boolean> {
        const query = CommentModel.where({_id: new ObjectId(commentId)}).where({"commentatorInfo.userId": userId})
        const res : CommentMongoModel | null = await query.findOne().lean<CommentMongoModel>() as CommentMongoModel;
        return !!res;
    }
    async getCommentById<T>(id: string, dto: (comment: CommentMongoModel) => T): Promise<T | null> {
        const comment: CommentMongoModel | null = await CommentModel.findOne({_id: new ObjectId(id)}).exec()
        if (comment) {
            return dto(comment);
        }
        return null;
    }
}

export const commentsQueryRepository = new CommentsQueryRepository();