import {Request, Response} from "express";
import {blogsRepository, postsRepository} from "../repositories";
import {ITestingRouterController, Status} from "../types";
import {usersRepository} from "../repositories/users-repository";
import {commentsRepository} from "../repositories/comments-repository";


class TestingRouterController implements ITestingRouterController {
    async clearAll(req: Request, res: Response) {
        await blogsRepository.clear();
        await postsRepository.clear();
        await usersRepository.clear();
        await commentsRepository.clear();
        return res.sendStatus(Status.NO_CONTENT);
    }
}

export const testingRouterController = new TestingRouterController();