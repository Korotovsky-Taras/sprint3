import {IUsersService, UserCreateModel, UserViewModel, UserWithConfirmedViewModel} from "../types";
import {usersRepository} from "../repositories/users-repository";

class UsersService implements IUsersService {

    /**
     * Создаст пользователя с подтверждением авторизации
     */
    async createUserWithVerification(model: UserCreateModel): Promise<UserWithConfirmedViewModel | null> {
        return usersRepository.createUserWithConfirmationCode(model);
    }

    /**
     * Создаст пользователя без подтверждения авторизации
     */
    async createUser(model: UserCreateModel): Promise<UserViewModel | null> {
        return usersRepository.createUser(model);
    }

    /**
     * Идентификация код-регитрации пользователя
     */
    async verifyUserWithConfirmationCode(code: string): Promise<boolean> {
        return usersRepository.verifyUserWithConfirmationCode(code);
    }

    async deleteUser(userId: string): Promise<boolean> {
        return usersRepository.deleteUserById(userId);
    }

}

export const userService = new UsersService();