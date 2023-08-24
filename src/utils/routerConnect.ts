import {NextFunction, Request, Response} from "express";
import {app} from "../app";
import {Route} from "../types";

export const connectRouter = <T>(routes: Route<T>[]) => {
    routes.forEach(router => {
        (app)[router.method](router.route,
            router.middlewares ? [...router.middlewares] : [],
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const controller = router.controller[router.action];
                    if (typeof controller === "function") {
                        const controllerResponse: Response = await controller(req, res, next);
                        // проверяем response на наличие заголовка ответа
                        if (!controllerResponse.headersSent) {
                            // здесь можно логировать те контроллеры которые не закрыли ответ
                            controllerResponse.end();
                        }
                    } else {
                        next();
                    }
                } catch (err) {
                    next(err)
                }
            })
    })
}
