import {NextFunction, Request, Response} from "express";
import {FieldError, Status} from "../types";
import {ApiError, normalizeValidationError} from "./ApiError";


export const withValidator = (validate: any) => {
    return validate().concat((req: Request, res: Response, next: NextFunction) => {
        const errors: FieldError[] = normalizeValidationError(req);
        if (errors && errors.length > 0) {
            throw new ApiError(Status.BAD_REQUEST, errors)
        }
        next();
    })
}