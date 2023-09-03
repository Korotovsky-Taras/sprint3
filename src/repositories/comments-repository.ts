import {CommentMongoModel, CommentUpdateModel} from "../types/comments";
import {CommentModel} from "./models/Comment";
import {HydratedDocument} from "mongoose";
import {ICommentsRepository} from "../types/repository";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";

class CommentsRepository implements ICommentsRepository {
    async updateCommentById(id: string, input: CommentUpdateModel): Promise<boolean> {
        const res: UpdateResult = await CommentModel.updateOne({_id: new ObjectId(id)}, {$set: input}).exec();
        return res.modifiedCount > 0;
    }
    async deleteCommentById(id: string): Promise<boolean> {
        const res: DeleteResult = await CommentModel.deleteOne({_id: new ObjectId(id)}).exec();
        return res.deletedCount > 0;
    }
    async saveDoc(doc: HydratedDocument<CommentMongoModel>): Promise<void> {
        await doc.save()
    }
    async clear(): Promise<void> {
        await CommentModel.deleteMany({});
    }
}

export const commentsRepository = new CommentsRepository();