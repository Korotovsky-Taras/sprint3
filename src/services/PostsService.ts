import {BlogViewModel, IPostsService, PostsCreateModel, PostsUpdateModel, PostViewModel} from "../types";
import {blogsRepository, postsRepository} from "../repositories";

class PostsService implements IPostsService {
    async createPost(model: PostsCreateModel): Promise<PostViewModel | null> {
        const blog: BlogViewModel | null = await blogsRepository.findBlogById(model.blogId);
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
    async updatePostById(blogId: string, model: PostsUpdateModel): Promise<boolean> {
        return postsRepository.updatePostById(blogId, model)
    }
    async deletePostById(blogId: string): Promise<boolean> {
        return postsRepository.deletePostById(blogId)
    }
}

export const postsService = new PostsService();
