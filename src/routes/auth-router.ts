import {IAuthRouterController, Route, RouterMethod} from "../types";
import {authRouterController} from "../controllers/AuthRouterController";
import {loginCreationValidator} from "../middlewares/login-create-validation";
import {authTokenAccessValidation} from "../middlewares/auth-token-access-validation";
import {
    authCodeValidation,
    authEmailResendingValidation,
    authRegistrationValidation
} from "../middlewares/auth-registration-validation";
import {authTokenRefreshValidation} from "../middlewares/auth-token-refresh-validation";
import {authRateLimiter} from "../middlewares/auth-rate-limiter";


export const authLoginRoute: Route<IAuthRouterController> = {
    route: "/auth/login",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: 'login',
    middlewares: [
        authRateLimiter(5,10),
        loginCreationValidator,
    ]
}

export const authLogoutRoute: Route<IAuthRouterController> = {
    route: "/auth/logout",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: 'logout',
    middlewares: [
        authTokenRefreshValidation,
    ]
}

export const authRefreshRoute: Route<IAuthRouterController> = {
    route: "/auth/refresh-token",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: 'refreshToken',
    middlewares: [
        authTokenRefreshValidation
    ]
}

export const authMeRoute: Route<IAuthRouterController> = {
    route: "/auth/me",
    method: RouterMethod.GET,
    controller: authRouterController,
    action: 'me',
    middlewares: [
        authTokenAccessValidation
    ]
}

export const authRegistrationRoute: Route<IAuthRouterController> = {
    route: "/auth/registration",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: 'registration',
    middlewares: [
        authRateLimiter(5,10),
        authRegistrationValidation,
    ]
}

export const authRegistrationConfirmationRoute: Route<IAuthRouterController> = {
    route: "/auth/registration-confirmation",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: 'registrationConfirmation',
    middlewares: [
        authRateLimiter(5,10),
        authCodeValidation,
    ]
}

export const authRegistrationEmailResendingRoute: Route<IAuthRouterController> = {
    route: "/auth/registration-email-resending",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: 'registrationEmailResending',
    middlewares: [
        authRateLimiter(5,10),
        authEmailResendingValidation,
    ]
}

export const authRoutes: Route<IAuthRouterController>[] = [
    authRegistrationEmailResendingRoute,
    authRegistrationConfirmationRoute,
    authRegistrationRoute,
    authLoginRoute,
    authLogoutRoute,
    authRefreshRoute,
    authMeRoute
];