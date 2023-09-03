import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";
import {LikeStatus} from "../types/likes";

export const commentCreateValidator = withValidator(() => {
    return [
        checkSchema({
            content: {
                in: ['body'],
                trim: true,
                isLength: {
                    options: {min: 20, max: 300},
                    errorMessage: "length should be > 20 < 300"
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

export const commentUpdateLikeStatusValidator = withValidator(() => {
    const enumValues = Object.values(LikeStatus);

    return [
        checkSchema({
            likeStatus: {
                in: ['body'],
                trim: true,
                errorMessage: 'Invalid field value',
                custom: {
                    options: async (likeStatus) => {
                        if (!enumValues.includes(likeStatus)) {
                            throw Error(`Field value must be one of ${enumValues.join(', ')}`)
                        }
                    },
                },
            }
        }),
    ]
})
