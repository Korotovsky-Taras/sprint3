import {IAuthRouterController, Route, RouterMethod} from "../types";
import {loginCreationValidator} from "../middlewares/login-create-validation";
import {authTokenAccessValidation} from "../middlewares/auth-token-access-validation";
import {
    authCodeValidation,
    authEmailResendingValidation,
    authRegistrationValidation,
} from "../middlewares/auth-registration-validation";
import {authTokenRefreshValidation} from "../middlewares/auth-token-refresh-validation";
import {authRateLimiter} from "../middlewares/auth-rate-limiter";
import {authNewPasswordValidation, authPasswordRecoveryValidation} from "../middlewares/auth-password-validation";
import {ioc} from "../ioc.config";
import {AuthRouterController} from "../controllers/AuthRouterController";


const controller = ioc.resolve<IAuthRouterController>(AuthRouterController);

export const authLoginRoute: Route<IAuthRouterController> = {
    route: "/auth/login",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.login,
    middlewares: [
        authRateLimiter(5,10),
        loginCreationValidator,
    ]
}

export const authLogoutRoute: Route<IAuthRouterController> = {
    route: "/auth/logout",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.logout,
    middlewares: [
        authTokenRefreshValidation,
    ]
}

export const authRefreshRoute: Route<IAuthRouterController> = {
    route: "/auth/refresh-token",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.refreshToken,
    middlewares: [
        authTokenRefreshValidation
    ]
}

export const authMeRoute: Route<IAuthRouterController> = {
    route: "/auth/me",
    method: RouterMethod.GET,
    controller: controller,
    action: controller.me,
    middlewares: [
        authTokenAccessValidation(true)
    ]
}

export const authRegistrationRoute: Route<IAuthRouterController> = {
    route: "/auth/registration",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.registration,
    middlewares: [
        authRateLimiter(5,10),
        authRegistrationValidation,
    ]
}

export const authRegistrationConfirmationRoute: Route<IAuthRouterController> = {
    route: "/auth/registration-confirmation",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.registrationConfirmation,
    middlewares: [
        authRateLimiter(5,10),
        authCodeValidation,
    ]
}

export const authRegistrationEmailResendingRoute: Route<IAuthRouterController> = {
    route: "/auth/registration-email-resending",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.registrationEmailResending,
    middlewares: [
        authRateLimiter(5,10),
        authEmailResendingValidation,
    ]
}

export const authPasswordRecoveryRoute: Route<IAuthRouterController> = {
    route: "/auth/password-recovery",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.passwordRecovery,
    middlewares: [
        authRateLimiter(5,10),
        authPasswordRecoveryValidation,
    ]
}

export const authNewPasswordRoute: Route<IAuthRouterController> = {
    route: "/auth/new-password",
    method: RouterMethod.POST,
    controller: controller,
    action: controller.recoverPasswordWithConfirmationCode,
    middlewares: [
        authRateLimiter(5,10),
        authNewPasswordValidation,
    ]
}

export const authRoutes: Route<IAuthRouterController>[] = [
    authRegistrationEmailResendingRoute,
    authRegistrationConfirmationRoute,
    authRegistrationRoute,
    authLoginRoute,
    authLogoutRoute,
    authRefreshRoute,
    authMeRoute,
    authPasswordRecoveryRoute,
    authNewPasswordRoute,
];