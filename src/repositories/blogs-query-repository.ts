import {Blog, BlogMongoModel, WithPagination, WithPaginationQuery} from "../types";
import {BlogModel} from "./models/Blog";
import {FilterQuery} from "mongoose";
import {withModelPagination} from "./utils/withModelPagination";
import {IBlogsQueryRepository} from "../types/repository";


class BlogsQueryRepository implements IBlogsQueryRepository {
    async getBlogs<T>(query: WithPaginationQuery<Blog> & {searchNameTerm: string | null}, dto: (blog: BlogMongoModel[]) => T[]): Promise<WithPagination<T>> {
        let filter: FilterQuery<Blog> = {};
        if (query.searchNameTerm != null) {
            filter.name = {$regex: query.searchNameTerm, $options: "i" }
        }
        return withModelPagination<BlogMongoModel, T>(BlogModel, filter, query, dto);
    }
    async getBlogById<T>(id: string, dto: (post: BlogMongoModel) => T): Promise<T | null>{
        let blog: BlogMongoModel | null = await BlogModel.findById(id).lean<BlogMongoModel>() as BlogMongoModel;
        if (blog) {
            return dto(blog);
        }
        return null
    }
}

export const blogsQueryRepository = new BlogsQueryRepository();