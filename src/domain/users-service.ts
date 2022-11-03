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
    async findUsers(data: FindUsersType): Promise<UsersTypeForService | null> {
        const foundsUsers = await usersRepositories.findUsers(data)
        const totalCount = await usersRepositories.usersCount(data)
        const pagesCountRes = Math.ceil(totalCount / data.pageSize)
        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: totalCount,
            items: foundsUsers ? foundsUsers : []
        }
    },
    async deleteUserById(id: string): Promise<boolean> {
        return usersRepositories.deleteUserById(id)
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        console.log('0 ---', loginOrEmail,password)
        const user: any = await usersRepositories.findByLoginOrEmail(loginOrEmail)
        console.log('1 - user', user)
        if (!user) return false
        const passwordHash = await this._compareHash(password, user.passwordHash)
        console.log('3- passwordHash==', passwordHash)
        return passwordHash;
    },
    async _generateHash(password: string) {
        const result = await bcrypt.hash(password, 10)
        console.log('4 -result', result)
        return result
    },
    async _compareHash(password: string, hash: string) {
        const validHash = await bcrypt.compare(password, hash)
        console.log('2 --validHash==', validHash)
        return validHash
    }
}