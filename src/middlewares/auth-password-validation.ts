import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";
import {usersQueryRepository} from "../repositories";


export const authPasswordRecoveryValidation = withValidator(() => {
    return [
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
})

export const authNewPasswordValidation = withValidator(() => {
    return [
        checkSchema({
            newPassword: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: {min: 6, max: 20},
                    errorMessage: "length should be >= 6 <= 20"
                },
            },
            recoveryCode: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                custom: {
                    options: async (code) => {
                        const result = await usersQueryRepository.getPassConfirmationValidation(code);
                        if (!result || result.isConfirmed) {
                            throw Error("code is not valid")
                        } else if (result.isExpired) {
                            throw Error("code is expired")
                        }
                    },
                },
            }
        }),
    ]
})
