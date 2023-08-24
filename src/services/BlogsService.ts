import {
    BlogCreateModel,
    BlogPostCreateModel,
    BlogUpdateModel,
    BlogViewModel,
    IBlogService,
    PostViewModel
} from "../types";
import {blogsRepository, postsRepository} from "../repositories";

class BlogsService implements IBlogService {
    async createBlog(model: BlogCreateModel): Promise<BlogViewModel> {
        return blogsRepository.createBlog(model);
    }
    async createPost(blogId: string, model: BlogPostCreateModel): Promise<PostViewModel | null> {
        const blog: BlogViewModel | null = await blogsRepository.findBlogById(blogId);
        if (blog) {
            return postsRepository.createPost({
                title: model.title,
                shortDescription: model.shortDescription,
                content: model.content,
                blogId: blog.id
            }, blog);
        }
        return null;
    }
    async updateBlogById(blogId: string, model: BlogUpdateModel): Promise<boolean> {
        return blogsRepository.updateBlogById(blogId, model)
    }
    async deleteBlogById(blogId: string): Promise<boolean> {
        return blogsRepository.deleteBlogById(blogId)
    }
}

export const blogsService = new BlogsService();
