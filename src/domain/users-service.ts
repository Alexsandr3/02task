import {UsersType} from "../routes/db";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {FindUsersType, usersRepositories} from "../repositories/users-db-repositories";

export type UsersTypeForService = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UsersType[]
}

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
    async findUsers(data: FindUsersType): Promise<UsersTypeForService> {
        const foundsUsers = await usersRepositories.findUsers(data)
        const totalCount = await usersRepositories.usersCount(data)
        const pagesCountRes = Math.ceil(totalCount / data.pageSize)
        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: totalCount,
            items: foundsUsers
        }
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