import {TestingRouterController} from "../controllers/TestingRouterController";
import {ITestingRouterController, Route, RouterMethod} from "../types";
import {ioc} from "../ioc.config";

const controller = ioc.resolve<ITestingRouterController>(TestingRouterController);

const testingRoute: Route<ITestingRouterController> = {
    route: "/testing/all-data",
    method: RouterMethod.DELETE,
    controller: controller,
    action: controller.clearAll
}

export const testingRoutes: Route<ITestingRouterController>[] = [
    testingRoute
];