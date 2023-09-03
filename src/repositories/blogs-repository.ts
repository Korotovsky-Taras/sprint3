import {BlogCreateModel, BlogMongoModel, BlogUpdateModel} from "../types";
import {BlogModel} from "./models/Blog";
import {HydratedDocument} from "mongoose";
import {IBlogsRepository} from "../types/repository";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";

class BlogsRepository implements IBlogsRepository {
    async createBlog<T>(input: BlogCreateModel, dto: (blog: BlogMongoModel) => T): Promise<T> {
        const model : HydratedDocument<BlogMongoModel> = BlogModel.createBlog(input);
        const blog: BlogMongoModel = await model.save();
        return dto(blog);
    }
    async updateBlogById(id: string, input: BlogUpdateModel): Promise<boolean> {
        const res: UpdateResult = await BlogModel.updateOne({_id: new ObjectId(id)},{$set: input}).exec();
        return res.modifiedCount > 0;
    }
    async deleteBlogById(id: string): Promise<boolean> {
        const res: DeleteResult = await BlogModel.deleteOne({_id: new ObjectId(id)}).exec();
        return res.deletedCount > 0;
    }
    async saveDoc(doc: HydratedDocument<BlogMongoModel>): Promise<void> {
        await doc.save()
    }
    async clear(): Promise<void> {
        await BlogModel.deleteMany({});
    }
}

export const blogsRepository = new BlogsRepository();