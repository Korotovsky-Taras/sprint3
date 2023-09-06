import {
    BlogCreateModel,
    BlogPostCreateModel,
    BlogUpdateModel,
    BlogViewModel,
    IBlogService,
    PostViewModel
} from "../types";
import {BlogsDto} from "../dto/blogs.dto";
import {PostsDto} from "../dto/posts.dto";
import {injectable} from "inversify";
import {PostsRepository} from "../repositories/posts-repository";
import {BlogsRepository} from "../repositories/blogs-repository";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";

@injectable()
export class BlogsService implements IBlogService {
    constructor(
        private readonly postsRepo: PostsRepository,
        private readonly blogsRepo: BlogsRepository,
        private readonly blogsQueryRepo: BlogsQueryRepository,
    ) {
    }

    async createBlog(model: BlogCreateModel): Promise<BlogViewModel> {
        return this.blogsRepo.createBlog(model, BlogsDto.blog);
    }

    async createPost(userId: string | null, blogId: string, model: BlogPostCreateModel): Promise<PostViewModel | null> {
        const blog: BlogViewModel | null = await this.blogsQueryRepo.getBlogById(blogId, BlogsDto.blog);
        if (blog) {
            return this.postsRepo.createPost(userId, {
                title: model.title,
                shortDescription: model.shortDescription,
                content: model.content,
                blogId: blog.id,
                blogName: blog.name
            }, PostsDto.post)
        }
        return null;
    }

    async updateBlogById(blogId: string, model: BlogUpdateModel): Promise<boolean> {
        return this.blogsRepo.updateBlogById(blogId, model)
    }

    async deleteBlogById(blogId: string): Promise<boolean> {
        return this.blogsRepo.deleteBlogById(blogId)
    }
}
