import {BlogViewModel, IPostsService, PostsCreateModel, PostsUpdateModel, PostViewModel} from "../types";
import {PostsDto} from "../dto/posts.dto";
import {BlogsDto} from "../dto/blogs.dto";
import {IBlogsQueryRepository, IPostsRepository} from "../types/repository";
import {blogsQueryRepository, postsRepository} from "../repositories";

class PostsService implements IPostsService {

    constructor(
        private readonly postsRepo: IPostsRepository,
        private readonly blogsQueryRepo: IBlogsQueryRepository,
    ) {
    }

    async createPost(model: PostsCreateModel): Promise<PostViewModel | null> {
        const blog: BlogViewModel | null = await this.blogsQueryRepo.getBlogById(model.blogId, BlogsDto.blog);
        if (blog) {
            return this.postsRepo.createPost({
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
}

export const postsService = new PostsService(postsRepository, blogsQueryRepository);