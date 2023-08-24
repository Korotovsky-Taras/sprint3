import {IUsersRouterController, Route, RouterMethod} from "../types";
import {usersRouterController} from "../controllers/UsersRouterController";
import {authBasicValidation} from "../middlewares/auth-basic-validation";
import {userCreateValidation} from "../middlewares/user-create-validation";


export const usersAllRoute: Route<IUsersRouterController> = {
    route: "/users",
    method: RouterMethod.GET,
    controller: usersRouterController,
    action: 'getAll',
}

export const userCreateRoute: Route<IUsersRouterController> = {
    route: "/users",
    method: RouterMethod.POST,
    controller: usersRouterController,
    action: 'createUser',
    middlewares: [
        authBasicValidation,
        userCreateValidation
    ]
}

export const usersDeleteRoute: Route<IUsersRouterController> = {
    route: "/users/:id",
    method: RouterMethod.DELETE,
    controller: usersRouterController,
    action: 'deleteUser',
    middlewares: [
        authBasicValidation,
    ]
}

export const usersRoutes: Route<IUsersRouterController>[] = [
    usersAllRoute,
    userCreateRoute,
    usersDeleteRoute,
];