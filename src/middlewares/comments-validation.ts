import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";

export const commentCreateValidator = withValidator(() => {
    return [
        checkSchema({
            content: {
                in: ['body'],
                trim: true,
                isLength: {
                    options: {min: 20, max: 300},
                    errorMessage: "length should be > 0"
                },
            }
        }),
    ]
})

export const commentUpdateValidator = withValidator(() => {
    return [
        checkSchema({
            content: {
                in: ['body'],
                trim: true,
                isLength: {
                    options: {min: 20, max: 300},
                    errorMessage: "length should be > 0"
                },
            }
        }),
    ]
})
