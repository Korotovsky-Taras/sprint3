import {PostMongoModel, PostPaginationRepositoryModel, WithPagination} from "../types";
import {IPostsQueryRepository} from "../types/repository";
import {withModelPagination} from "./utils/withModelPagination";
import {PostModel} from "./models/Post";

class PostsQueryRepository implements IPostsQueryRepository {
    async getPosts<T>(userId: string, filter: Partial<PostMongoModel>, query: PostPaginationRepositoryModel, dto: (posts: PostMongoModel[], userId: string | null) => T[]): Promise<WithPagination<T>> {
        return withModelPagination<PostMongoModel, T>(PostModel, filter, query, (items) => {
            return dto(items, userId)
        });
    }
    async getPostById<T>(userId: string | null, id: string, dto: (post: PostMongoModel, userId: string | null) => T): Promise<T | null> {
        const post: PostMongoModel | null = await PostModel.findById(id).lean<PostMongoModel>() as PostMongoModel;
        if(post) {
            return dto(post, userId)
        }
        return null
    }
    async isPostExist<T>(id: string): Promise<boolean> {
        const post : PostMongoModel | null = await PostModel.findById(id).lean<PostMongoModel>() as PostMongoModel;
        return !!post
    }
}

export const postsQueryRepository = new PostsQueryRepository();