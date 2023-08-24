import {
    BlogViewModel,
    Post,
    PostMongoModel,
    PostPaginationRepositoryModel,
    PostsCreateModel,
    PostsListViewModel,
    PostsUpdateModel,
    PostViewModel
} from "../types";
import {withMongoLogger} from "../utils/withMongoLogger";
import {postsCollection} from "../db";
import {ObjectId} from "mongodb";
import {PostsDto} from "../dto/posts.dto";
import {withMongoQueryFilterPagination} from "./utils/";
import {toIsoString} from "../utils/date";

export const postsRepository = {
    async getPosts(filter: Partial<PostMongoModel>, query: PostPaginationRepositoryModel): Promise<PostsListViewModel> {
        return withMongoLogger<PostsListViewModel>(async () => {
            return withMongoQueryFilterPagination<Post, PostViewModel>(postsCollection, PostsDto.allPosts, filter, query);
        });
    },
    async createPost(input: PostsCreateModel, blog: BlogViewModel): Promise<PostViewModel> {
        return withMongoLogger<PostViewModel>(async () => {
            const newPost: Post = {
                title: input.title,
                shortDescription: input.shortDescription,
                content: input.content,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: toIsoString(new Date()),
            }
            const res = await postsCollection.insertOne(newPost);
            return PostsDto.post({
                _id: res.insertedId,
                ...newPost,
            });
        });
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        return withMongoLogger<PostViewModel | null>(async () => {
            const post: PostMongoModel | null = await postsCollection.findOne({_id: new ObjectId(id)});
            return post ? PostsDto.post(post) : null;
        })
    },
    async updatePostById(id: string, input: PostsUpdateModel): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: input});
            return result.matchedCount === 1;
        })
    },
    async deletePostById(id: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await postsCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        })
    },
    async clear(): Promise<void> {
        return withMongoLogger<void>(async () => {
            await postsCollection.deleteMany({});
        })
    }
}