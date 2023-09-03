import {PostMongoModel, PostPaginationRepositoryModel, WithPagination} from "../types";
import {IPostsQueryRepository} from "../types/repository";
import {withModelPagination} from "./utils/withModelPagination";
import {PostModel} from "./models/Post";

class PostsQueryRepository implements IPostsQueryRepository {
    async getPosts<T>(filter: Partial<PostMongoModel>, query: PostPaginationRepositoryModel, dto: (posts: PostMongoModel[]) => T[]): Promise<WithPagination<T>> {
        return withModelPagination<PostMongoModel, T>(PostModel, filter, query, dto);
    }
    async getPostById<T>(id: string, dto: (post: PostMongoModel) => T): Promise<T | null> {
        const post: PostMongoModel | null = await PostModel.findById(id).lean<PostMongoModel>() as PostMongoModel;
        if(post) {
            return dto(post)
        }
        return null
    }
}

export const postsQueryRepository = new PostsQueryRepository();