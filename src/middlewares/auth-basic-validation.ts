import {appConfig} from "../utils/config";
import {NextFunction, Request, Response} from "express";
import {Status} from "../types";

const isBase64 = (text: string): boolean => {
    return new RegExp(/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,'gi').test(text);
}

const validateAuth = (basicAuth: string): boolean => {
    if (basicAuth.includes(":")) {
        const [login, password] = basicAuth.split(":");
        const {authLogin, authPassword} = appConfig;
        if (login.toLowerCase() === authLogin.toLowerCase()
            && password.toLowerCase() === authPassword.toLowerCase()) {
            return true;
        }
    }
    return false
}

export const authBasicValidation = (req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers;
    if (authorization) {
        const authorizationData = authorization.split(" ")
        if (authorizationData.length > 1 && authorizationData[0] === 'Basic') {
            const basicAuth = authorizationData[1];
            if (isBase64(basicAuth) && validateAuth(atob(basicAuth))) {
                return next();
            }
        }
    }
    res.sendStatus(Status.UNATHORIZED);
}