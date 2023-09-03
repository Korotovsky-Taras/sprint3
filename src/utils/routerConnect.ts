import {NextFunction, Request, Response} from "express";
import {app} from "../app";
import {Route} from "../types";

export const connectRouter = <T>(routes: Route<T>[]) => {
    routes.forEach(router => {
        (app)[router.method](router.route,
            router.middlewares ? [...router.middlewares] : [],
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const controllerAction = router.action.bind(router.controller);
                    if (typeof controllerAction === "function") {
                        const controllerResponse: Response = await controllerAction(req, res, next);
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
