import {UsersViewType} from "../types/users_types";
import bcrypt from 'bcrypt'
import {usersRepositories} from "../repositories/users-db-repositories";
import {jwtService} from "../application/jwt-servise";

export const usersService = {
    async createUser(login: string, email: string, password: string): Promise<UsersViewType> {
        const passwordHash = await this._generateHash(password)
        return await usersRepositories.createUser(login, email, password, passwordHash)
    },
    async deleteUserById(id: string): Promise<boolean> {
        return usersRepositories.deleteUserById(id)
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user: any = await usersRepositories.findByLoginOrEmail(loginOrEmail)
        if (!user) return null
        const result = await this._compareHash(password, user.passwordHash)
        if (!result) return null
        return await jwtService.createJwt(user)
    },
    async _generateHash(password: string) {
        return await bcrypt.hash(password, 10)
    },
    async _compareHash(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }
}