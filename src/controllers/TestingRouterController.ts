import {Request, Response} from "express";
import {ITestingRouterController, Status} from "../types";
import {injectable} from "inversify";
import {BlogsRepository} from "../repositories/blogs-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {UsersRepository} from "../repositories/users-repository";
import {CommentsRepository} from "../repositories/comments-repository";

@injectable()
export class TestingRouterController implements ITestingRouterController {
    constructor(
        private readonly blogsRepo: BlogsRepository,
        private readonly postsRepo: PostsRepository,
        private readonly usersRepo: UsersRepository,
        private readonly commentsRepo: CommentsRepository,
    ) {}

    async clearAll(req: Request, res: Response) {
        await this.blogsRepo.clear();
        await this.postsRepo.clear();
        await this.usersRepo.clear();
        await this.commentsRepo.clear();
        return res.sendStatus(Status.NO_CONTENT);
    }
}
