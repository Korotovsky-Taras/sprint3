import {Response} from "express";
import {blogsRepository, postsRepository} from "../repositories";

import {
    BlogCreateModel,
    BlogListViewModel,
    BlogPaginationQueryModel,
    BlogPostCreateModel,
    BlogUpdateModel,
    BlogViewModel,
    IBlogsRouterController,
    ParamIdModel,
    PostPaginationQueryModel,
    PostPaginationRepositoryModel,
    PostsListViewModel,
    PostViewModel,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithParamsQuery,
    RequestWithQuery,
    Status
} from "../types";
import {BlogsDto} from "../dto/blogs.dto";
import {blogsService} from "../services/BlogsService";
import {PostsDto} from "../dto/posts.dto";


class BlogsRouterController implements IBlogsRouterController {

    async getAll(req: RequestWithQuery<BlogPaginationQueryModel>, res: Response<BlogListViewModel>) {
        const model: BlogListViewModel = await blogsRepository.getBlogs(BlogsDto.toRepoQuery(req.query));
        return res.status(Status.OK).send(model);
    }

    async getBlog(req: RequestWithParams<ParamIdModel>, res: Response<BlogViewModel | null>) {
        const blog: BlogViewModel | null = await blogsRepository.findBlogById(req.params.id);
        if (blog) {
            return res.status(Status.OK).send(blog);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async createBlog(req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel>) {
        const blog: BlogViewModel = await blogsService.createBlog(req.body)
        return res.status(Status.CREATED).send(blog);
    }

    async getBlogPosts(req: RequestWithParamsQuery<ParamIdModel, PostPaginationQueryModel>, res: Response<PostsListViewModel>) {
        const {id} = req.params;
        const blog: BlogViewModel | null = await blogsRepository.findBlogById(id)
        if (blog) {
            const query: PostPaginationRepositoryModel = PostsDto.toRepoQuery(req.query);
            const model: PostsListViewModel =  await postsRepository.getPosts({blogId: id}, query);
            return res.status(Status.OK).send(model);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async createBlogPost(req: RequestWithParamsBody<ParamIdModel, BlogPostCreateModel>, res: Response<PostViewModel>) {
        const post: PostViewModel | null = await blogsService.createPost(req.params.id, {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
        });
        if (post) {
            return res.status(Status.CREATED).send(post);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async updateBlog(req: RequestWithParamsBody<ParamIdModel, BlogUpdateModel>, res: Response) {
        const isUpdated : boolean = await blogsService.updateBlogById(req.params.id, req.body);
        if (isUpdated) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async deleteBlog(req: RequestWithParams<ParamIdModel>, res: Response) {
        const isDeleted = await blogsService.deleteBlogById(req.params.id);
        if (isDeleted) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
}

export const blogsRouterController = new BlogsRouterController();