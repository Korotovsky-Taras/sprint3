import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";

export const loginCreationValidator = withValidator(() => {
    return [
        checkSchema({
            loginOrEmail: {
                in: ['body'],
                trim: true,
                isLength: {
                    options: { min: 1},
                    errorMessage: "should be not empty"
                },
            }
        }),
        checkSchema({
            password: {
                in: ['body'],
                trim: true,
                isLength: {
                    options: { min: 1},
                    errorMessage: "should be not empty"
                },
            }
        }),
    ]
});