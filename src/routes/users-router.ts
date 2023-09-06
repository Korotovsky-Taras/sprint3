import {IUsersRouterController, Route, RouterMethod} from "../types";
import {UsersRouterController} from "../controllers/UsersRouterController";
import {authBasicValidation} from "../middlewares/auth-basic-validation";
import {userCreateValidation} from "../middlewares/user-create-validation";
import {ioc} from "../ioc.config";

const controller = ioc.resolve<IUsersRouterController>(UsersRouterController);

export const usersAllRoute: Route<IUsersRouterController> = {
    route: "/users",
    method: RouterMethod.GET,
    controller: controller,
    action: controller.getAll,
}

export const userCreateRoute: Route<IUsersRouterController> = {
    route: "/users",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.createUser,
    middlewares: [
        authBasicValidation,
        userCreateValidation
    ]
}

export const usersDeleteRoute: Route<IUsersRouterController> = {
    route: "/users/:id",
    method: RouterMethod.DELETE,
    controller: controller,
    action: controller.deleteUser,
    middlewares: [
        authBasicValidation,
    ]
}

export const usersRoutes: Route<IUsersRouterController>[] = [
    usersAllRoute,
    userCreateRoute,
    usersDeleteRoute,
];