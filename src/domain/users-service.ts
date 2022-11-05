import {UsersType} from "../types/users_types";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import { usersRepositories} from "../repositories/users-db-repositories";

export const usersService = {
    async createUser(login: string, email: string, password: string): Promise<UsersType> {
        const passwordHash = await this._generateHash(password)
        const newUser: UsersType = {
            _id: new ObjectId(),
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString()
        }
        return usersRepositories.createUser(newUser)
    },
    async deleteUserById(id: string): Promise<boolean> {
        return usersRepositories.deleteUserById(id)
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user: any = await usersRepositories.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const passwordHash = await this._compareHash(password, user.passwordHash)
        return passwordHash;
    },
    async _generateHash(password: string) {
        const result = await bcrypt.hash(password, 10)
        return result
    },
    async _compareHash(password: string, hash: string) {
        const validHash = await bcrypt.compare(password, hash)
        return validHash
    }
}