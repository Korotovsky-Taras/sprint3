import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";

export const userCreateValidation = withValidator(() => {
    return [
        checkSchema({
            login: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 3, max: 10 },
                    errorMessage: "length should be >= 3 <= 10"
                },
            }
        }),
        checkSchema({
            password: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 6, max: 20 },
                    errorMessage: "length should be >= 6 <= 20"
                },
            }
        }),
        checkSchema({
            email: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                matches: {
                    options: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    errorMessage: "should match email pattern"
                },
            }
        }),
    ]
});