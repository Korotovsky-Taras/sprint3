import {PostMongoModel, PostsCreateModel, PostsUpdateModel} from "../types";
import {IPostsRepository} from "../types/repository";
import {PostModel} from "./models/Post";
import {HydratedDocument} from "mongoose";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";

class PostsRepository implements IPostsRepository {
    async createPost<T>(input: PostsCreateModel, dto: (post: PostMongoModel) => T): Promise<T> {
        const model : HydratedDocument<PostMongoModel> = PostModel.createPost(input)
        const post: PostMongoModel = await model.save();
        return dto(post);
    }
    async updatePostById(id: string, input: PostsUpdateModel): Promise<boolean> {
        const res: UpdateResult = await PostModel.updateOne({_id: new ObjectId(id)}, {$set: input}).exec();
        return res.modifiedCount > 0;
    }
    async deletePostById(id: string): Promise<boolean> {
        const res: DeleteResult = await PostModel.deleteOne({_id: new ObjectId(id)}).exec();
        return res.deletedCount > 0;
    }
    async saveDoc(doc: HydratedDocument<PostMongoModel>): Promise<void> {
        await doc.save()
    }
    async clear(): Promise<void> {
        await PostModel.deleteMany({});
    }
}

export const postsRepository = new PostsRepository();