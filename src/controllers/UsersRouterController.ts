import {
    IUsersRouterController,
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
import {injectable} from "inversify";
import {UsersService} from "../services/UsersService";
import {UsersQueryRepository} from "../repositories/users-query-repository";

@injectable()
export class UsersRouterController implements IUsersRouterController {

    constructor(
        private readonly usersService: UsersService,
        private readonly usersQueryRepo: UsersQueryRepository
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
