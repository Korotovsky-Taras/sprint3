import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";
import {usersRepository} from "../repositories/users-repository";
import {UserWithConfirmedViewModel} from "../types";
import {userCreateValidation} from "./user-create-validation";


export const authEmailValidation = withValidator(() => {
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

export const authCodeValidation = withValidator(() => {
    return [
        checkSchema({
            code: {
                in: ['body'],
                trim: true,
                isLength: {
                    options: { min: 1 },
                    errorMessage: "code should not be empty"
                },
                custom: {
                    options: async (code) => {
                        const isCodeValid = await usersRepository.isConfirmationCodeValid(code);
                        if (!isCodeValid) {
                            throw Error("code is not valid")
                        }
                    },
                },
            }
        }),
    ]
})

export const authEmailResendingValidation = withValidator(() => {
    return [
        ...authEmailValidation,
        checkSchema({
            email: {
                in: ['body'],
                trim: true,
                custom: {
                    options: async (email) => {
                        const user: UserWithConfirmedViewModel | null = await usersRepository.getUserWithConfirmationByEmail(email);
                        if (!user) {
                            throw Error("email doesnt exist")
                        } else if (user.confirmed) {
                            throw Error("email already confirmed")
                        }
                    },
                },
            }
        }),
    ]
})

export const authRegistrationValidation = withValidator(() => {
    return [
        ...userCreateValidation,
        checkSchema({
            login: {
                in: ['body'],
                trim: true,
                custom: {
                    options: async (login) => {
                        const user = await usersRepository.getUserByLogin(login);
                        if (user) {
                            throw Error("login already in use")
                        }
                    },
                },
            }
        }),
        checkSchema({
            email: {
                in: ['body'],
                trim: true,
                custom: {
                    options: async (email) => {
                        const user: UserWithConfirmedViewModel | null = await usersRepository.getUserWithConfirmationByEmail(email);
                        if (user) {
                            throw Error("email already exist")
                        }
                    },
                },
            }
        }),
    ]
})
