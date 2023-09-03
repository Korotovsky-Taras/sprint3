import {
    IUsersRouterController,
    IUsersService,
    ParamIdModel,
    RequestWithBody,
    RequestWithParams,
    RequestWithQuery,
    Status,
    UserCreateRequestModel,
    UserListViewModel,
    UserPaginationQueryModel,
    UserViewModel
} from "../types";
import {NextFunction, Response} from "express";
import {UsersDto} from "../dto/users.dto";
import {usersService} from "../services/UsersService";
import {IUsersQueryRepository} from "../types/repository";
import {usersQueryRepository} from "../repositories";


class UsersRouterController implements IUsersRouterController {

    constructor(
        private readonly usersService: IUsersService,
        private readonly usersQueryRepo: IUsersQueryRepository
    ) {
    }

    async getAll(req: RequestWithQuery<UserPaginationQueryModel>, res: Response<UserListViewModel>) {
        const users: UserListViewModel = await this.usersQueryRepo.getUsers(UsersDto.toRepoQuery(req.query), UsersDto.allUsers)
        return res.status(Status.OK).send(users);
    }

    async createUser(req: RequestWithBody<UserCreateRequestModel>, res: Response, next: NextFunction) {
        const user: UserViewModel | null = await this.usersService.createUser(req.body);

        if (user) {
            return res.status(Status.CREATED).send(user);
        }
        return res.sendStatus(Status.BAD_REQUEST);
    }

    async deleteUser(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        const isDeleted: boolean = await this.usersService.deleteUser(req.params.id);
        if (isDeleted) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
}

export const usersRouterController = new UsersRouterController(usersService, usersQueryRepository);