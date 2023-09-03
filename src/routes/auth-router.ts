import {IAuthRouterController, Route, RouterMethod} from "../types";
import {authRouterController} from "../controllers/AuthRouterController";
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


export const authLoginRoute: Route<IAuthRouterController> = {
    route: "/auth/login",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: authRouterController.login,
    middlewares: [
        authRateLimiter(5,10),
        loginCreationValidator,
    ]
}

export const authLogoutRoute: Route<IAuthRouterController> = {
    route: "/auth/logout",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: authRouterController.logout,
    middlewares: [
        authTokenRefreshValidation,
    ]
}

export const authRefreshRoute: Route<IAuthRouterController> = {
    route: "/auth/refresh-token",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: authRouterController.refreshToken,
    middlewares: [
        authTokenRefreshValidation
    ]
}

export const authMeRoute: Route<IAuthRouterController> = {
    route: "/auth/me",
    method: RouterMethod.GET,
    controller: authRouterController,
    action: authRouterController.me,
    middlewares: [
        authTokenAccessValidation(true)
    ]
}

export const authRegistrationRoute: Route<IAuthRouterController> = {
    route: "/auth/registration",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: authRouterController.registration,
    middlewares: [
        authRateLimiter(5,10),
        authRegistrationValidation,
    ]
}

export const authRegistrationConfirmationRoute: Route<IAuthRouterController> = {
    route: "/auth/registration-confirmation",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: authRouterController.registrationConfirmation,
    middlewares: [
        authRateLimiter(5,10),
        authCodeValidation,
    ]
}

export const authRegistrationEmailResendingRoute: Route<IAuthRouterController> = {
    route: "/auth/registration-email-resending",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: authRouterController.registrationEmailResending,
    middlewares: [
        authRateLimiter(5,10),
        authEmailResendingValidation,
    ]
}

export const authPasswordRecoveryRoute: Route<IAuthRouterController> = {
    route: "/auth/password-recovery",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: authRouterController.passwordRecovery,
    middlewares: [
        authRateLimiter(5,10),
        authPasswordRecoveryValidation,
    ]
}

export const authNewPasswordRoute: Route<IAuthRouterController> = {
    route: "/auth/new-password",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: authRouterController.recoverPasswordWithConfirmationCode,
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