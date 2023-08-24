import {
    IUsersRouterController,
    ParamIdModel,
    RequestWithBody,
    RequestWithParams,
    RequestWithQuery,
    Status,
    UserCreateModel,
    UserListViewModel,
    UserPaginationQueryModel,
    UserViewModel
} from "../types";
import {NextFunction, Response} from "express";
import {usersRepository} from "../repositories/users-repository";
import {UsersDto} from "../dto/users.dto";
import {userService} from "../services/UsersService";


class UsersRouterController implements IUsersRouterController {
    async getAll(req: RequestWithQuery<UserPaginationQueryModel>, res: Response<UserListViewModel>) {
        const users: UserListViewModel = await usersRepository.getAll(UsersDto.toRepoQuery(req.query))
        return res.status(Status.OK).send(users);
    }
    async createUser(req: RequestWithBody<UserCreateModel>, res: Response, next: NextFunction) {
        const user: UserViewModel | null = await userService.createUser(req.body);
        if (user) {
            return res.status(Status.CREATED).send(user);
        }
        return res.sendStatus(Status.BAD_REQUEST);
    }
    async deleteUser(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        const isDeleted: boolean = await userService.deleteUser(req.params.id);
        if (isDeleted) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
}

export const usersRouterController = new UsersRouterController();