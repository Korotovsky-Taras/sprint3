import {
    BlogViewModel,
    IPostsService,
    PostMongoModel,
    PostsCreateModel,
    PostsLikeStatusInputModel,
    PostsUpdateModel,
    PostViewModel
} from "../types";
import {PostsDto} from "../dto/posts.dto";
import {BlogsDto} from "../dto/blogs.dto";
import {HydratedDocument} from "mongoose";
import {ObjectId} from "mongodb";
import {IPostMethods, PostModel} from "../repositories/models/Post";
import {injectable} from "inversify";
import {PostsRepository} from "../repositories/posts-repository";
import {PostsQueryRepository} from "../repositories/posts-query-repository";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";

@injectable()
export class PostsService implements IPostsService {

    constructor(
        private readonly postsRepo: PostsRepository,
        private readonly postsQueryRepo: PostsQueryRepository,
        private readonly blogsQueryRepo: BlogsQueryRepository,
    ) {
    }

    async createPost(userId: string | null, model: PostsCreateModel): Promise<PostViewModel | null> {
        const blog: BlogViewModel | null = await this.blogsQueryRepo.getBlogById(model.blogId, BlogsDto.blog);
        if (blog) {
            return this.postsRepo.createPost(userId, {
                title: model.title,
                shortDescription: model.shortDescription,
                content: model.content,
                blogId: blog.id,
                blogName: blog.name
            }, PostsDto.post);
        }
        return null;
    }
    async updatePostById(blogId: string, model: PostsUpdateModel): Promise<boolean> {
        return this.postsRepo.updatePostById(blogId, model)
    }
    async deletePostById(blogId: string): Promise<boolean> {
        return this.postsRepo.deletePostById(blogId)
    }

    async updateLikeStatus(model: PostsLikeStatusInputModel): Promise<boolean> {
        const post : HydratedDocument<PostMongoModel, IPostMethods> | null = await PostModel.findOne({_id: new ObjectId(model.postId)}).exec();

        if (!post) {
            return false
        }

        await post.updateLike(model.userId, model.status);

        await this.postsRepo.saveDoc(post);

        return true;
    }

}
