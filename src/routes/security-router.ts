import {ISecurityRouterController, Route, RouterMethod} from "../types";
import {SecurityRouterController} from "../controllers/SecurityRouterController";
import {authTokenRefreshValidation} from "../middlewares/auth-token-refresh-validation";
import {ioc} from "../ioc.config";

const controller = ioc.resolve<ISecurityRouterController>(SecurityRouterController);

export const securityDevicesRoute: Route<ISecurityRouterController> = {
    route: "/security/devices",
    method: RouterMethod.GET,
    controller: controller,
    action: controller.getAll,
    middlewares: [
        authTokenRefreshValidation,
    ]
}

export const securityDeleteDeviceRoute: Route<ISecurityRouterController> = {
    route: "/security/devices/:id",
    method: RouterMethod.DELETE,
    controller: controller,
    action: controller.deleteDevice,
    middlewares: [
        authTokenRefreshValidation,
    ]
}

export const securityDeleteAllRoute: Route<ISecurityRouterController> = {
    route: "/security/devices",
    method: RouterMethod.DELETE,
    controller: controller,
    action: controller.deleteAll,
    middlewares: [
        authTokenRefreshValidation,
    ]
}

export const securityRoutes: Route<ISecurityRouterController>[] = [
    securityDevicesRoute,
    securityDeleteDeviceRoute,
    securityDeleteAllRoute,
];