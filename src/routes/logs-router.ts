import {ILogsRouterController, Route, RouterMethod} from "../types";
import {LogsRouterController} from "../controllers/LogsRouterController";
import {ioc} from "../ioc.config";

const controller = ioc.resolve<ILogsRouterController>(LogsRouterController);

export const logsRoute: Route<ILogsRouterController> = {
    route: "/logs",
    method: RouterMethod.GET,
    controller: controller,
    action: controller.getAll,
}

export const clearLogsRoute: Route<ILogsRouterController> = {
    route: "/logs",
    method: RouterMethod.DELETE,
    controller: controller,
    action: controller.deleteAll,
}

export const logsRoutes: Route<ILogsRouterController>[] = [
    logsRoute,
    clearLogsRoute,
];





