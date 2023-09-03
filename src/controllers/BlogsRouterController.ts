import {Response} from "express";

import {
    BlogCreateModel,
    BlogPaginationQueryModel,
    BlogPostCreateModel,
    BlogUpdateModel,
    BlogViewModel,
    IBlogService,
    IBlogsRouterController,
    ParamIdModel,
    PostPaginationQueryModel,
    PostViewModel,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithParamsQuery,
    RequestWithQuery,
    Status,
    WithPagination
} from "../types";

import {BlogsDto} from "../dto/blogs.dto";
import {PostsDto} from "../dto/posts.dto";

import {blogsService} from "../services/BlogsService";
import {IBlogsQueryRepository, IPostsQueryRepository} from "../types/repository";
import {blogsQueryRepository, postsQueryRepository} from "../repositories";


class BlogsRouterController implements IBlogsRouterController {

    constructor(
        private readonly blogsService: IBlogService,
        private readonly blogsQueryRepo: IBlogsQueryRepository,
        private readonly postsQueryRepo: IPostsQueryRepository,
    ) {
    }

    async getAll(req: RequestWithQuery<BlogPaginationQueryModel>, res: Response<{}>) {
        const blogs: WithPagination<BlogViewModel> = await this.blogsQueryRepo.getBlogs(BlogsDto.toRepoQuery(req.query), BlogsDto.allBlogs)
        return res.status(Status.OK).send(blogs);
    }

    async getBlog(req: RequestWithParams<ParamIdModel>, res: Response<BlogViewModel | null>) {
        const blog: BlogViewModel | null = await this.blogsQueryRepo.getBlogById(req.params.id, BlogsDto.blog);
        if (blog) {
            return res.status(Status.OK).send(blog);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async createBlog(req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel>) {
        const blog: BlogViewModel = await this.blogsService.createBlog(req.body)
        return res.status(Status.CREATED).send(blog);
    }

    async getBlogPosts(req: RequestWithParamsQuery<ParamIdModel, PostPaginationQueryModel>, res: Response<WithPagination<PostViewModel>>) {
        const {id} = req.params;
        const blog: BlogViewModel | null = await this.blogsQueryRepo.getBlogById(id, BlogsDto.blog)
        if (blog) {
            const posts: WithPagination<PostViewModel> = await this.postsQueryRepo.getPosts({blogId: id}, PostsDto.toRepoQuery(req.query), PostsDto.allPosts);
            return res.status(Status.OK).send(posts);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async createBlogPost(req: RequestWithParamsBody<ParamIdModel, BlogPostCreateModel>, res: Response<PostViewModel>) {
        const post: PostViewModel | null = await this.blogsService.createPost(req.params.id, {
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
        const isUpdated: boolean = await this.blogsService.updateBlogById(req.params.id, req.body);
        if (isUpdated) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async deleteBlog(req: RequestWithParams<ParamIdModel>, res: Response) {
        const isDeleted = await this.blogsService.deleteBlogById(req.params.id);
        if (isDeleted) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
}

export const blogsRouterController = new BlogsRouterController(blogsService, blogsQueryRepository, postsQueryRepository);