import {ErrorsMessage, FieldError, Status} from "../types";
import {ValidationError, validationResult} from "express-validator";
import {Request} from "express";

export class ApiError extends Error {
    status: Status;
    errors: ErrorsMessage | null;
    constructor(status: number, errors: FieldError[] | null) {
        super();
        this.status = status;
        this.errors = errors ? {
            errorsMessages: errors
        } : null;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export const normalizeValidationError = (req: Request): FieldError[] => {
    const result: ValidationError[] = validationResult(req).array({onlyFirstError: true});
    const errors: FieldError[] = [];

    result.forEach(error => {
        switch (error.type) {
            case 'field':
                errors.push({
                    message: error.msg,
                    field: error.path
                });
                break;
            case 'alternative':
                error.nestedErrors.forEach(e => {
                    errors.push({
                        message: e.msg,
                        field: e.path
                    });
                })
                break;

            case 'alternative_grouped':
                error.nestedErrors.forEach((nestedErrors) => {
                    nestedErrors.forEach(e => {
                        errors.push({
                            message: e.msg,
                            field: e.path
                        });
                    })
                });
                break;

            case 'unknown_fields':
                error.fields.forEach(e => {
                    errors.push({
                        message: error.msg,
                        field: e.path
                    });
                })
                break;
        }
    })

    return errors;
}