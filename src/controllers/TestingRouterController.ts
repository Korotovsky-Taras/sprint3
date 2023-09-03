import {Request, Response} from "express";
import {ITestingRouterController, Status} from "../types";
import {IBlogsRepository, ICommentsRepository, IPostsRepository, IUsersRepository} from "../types/repository";
import {blogsRepository, commentsRepository, postsRepository, usersRepository} from "../repositories";


class TestingRouterController implements ITestingRouterController {
    constructor(
        private readonly blogsRepo: IBlogsRepository,
        private readonly postsRepo: IPostsRepository,
        private readonly usersRepo: IUsersRepository,
        private readonly commentsRepo: ICommentsRepository,
    ) {}

    async clearAll(req: Request, res: Response) {
        await this.blogsRepo.clear();
        await this.postsRepo.clear();
        await this.usersRepo.clear();
        await this.commentsRepo.clear();
        return res.sendStatus(Status.NO_CONTENT);
    }
}

export const testingRouterController = new TestingRouterController(blogsRepository, postsRepository, usersRepository, commentsRepository);