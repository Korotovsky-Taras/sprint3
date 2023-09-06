import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";
import {UserWithConfirmedViewModel} from "../types";
import {userCreateValidation} from "./user-create-validation";
import {UsersDto} from "../dto/users.dto";
import {IUsersQueryRepository} from "../types/repository";
import {ioc} from "../ioc.config";
import {UsersQueryRepository} from "../repositories/users-query-repository";

const usersQueryRepository : IUsersQueryRepository =  ioc.resolve<IUsersQueryRepository>(UsersQueryRepository)

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
                        const result = await usersQueryRepository.getAuthConfirmationValidation(code);
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

export const authEmailResendingValidation = withValidator(() => {
    return [
        ...authEmailValidation,
        checkSchema({
            email: {
                in: ['body'],
                trim: true,
                custom: {
                    options: async (email) => {
                        const user: UserWithConfirmedViewModel | null = await usersQueryRepository.getUserByFilter({email}, UsersDto.userWithAuthConfirmation);
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
                        const user = await usersQueryRepository.getUserByFilter({login}, UsersDto.user);
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
                        const user = await usersQueryRepository.getUserByFilter({email}, UsersDto.user);
                        if (user) {
                            throw Error("email already exist")
                        }
                    },
                },
            }
        }),
    ]
})
