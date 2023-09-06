import {
    BlogCreateModel,
    BlogPostCreateModel,
    BlogUpdateModel,
    BlogViewModel,
    IBlogService,
    PostViewModel
} from "../types";
import {BlogsDto} from "../dto/blogs.dto";
import {IBlogsQueryRepository, IBlogsRepository, IPostsRepository} from "../types/repository";
import {blogsQueryRepository, blogsRepository, postsRepository} from "../repositories";
import {PostsDto} from "../dto/posts.dto";

class BlogsService implements IBlogService {
    constructor(
        private readonly postsRepo: IPostsRepository,
        private readonly blogsRepo: IBlogsRepository,
        private readonly blogsQueryRepo: IBlogsQueryRepository,
    ) {
    }

    async createBlog(model: BlogCreateModel): Promise<BlogViewModel> {
        return this.blogsRepo.createBlog(model, BlogsDto.blog);
    }

    async createPost(userId: string, blogId: string, model: BlogPostCreateModel): Promise<PostViewModel | null> {
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

export const blogsService = new BlogsService(postsRepository, blogsRepository, blogsQueryRepository);