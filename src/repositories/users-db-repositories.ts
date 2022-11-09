import {usersCollection} from "../routes/db";
import {ObjectId} from "mongodb";
import {UsersDBType, UsersViewType} from "../types/users_types";


const userWithNewId = (object: UsersDBType): UsersViewType => {
    return {
        id: object._id.toString(),
        login: object.login,
        email: object.email,
        createdAt: object.createdAt
    }
}


export const usersRepositories = {
    async createUser(login: string, email: string, password: string, passwordHash: string): Promise<UsersViewType> {
        const newUser: UsersDBType = {
            _id: new ObjectId(),
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString()
        }
        await usersCollection.insertOne(newUser)
        return userWithNewId(newUser)
    },
    async deleteUserById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<UsersDBType | null> {
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },
    async deleteAll() {
        await usersCollection.deleteMany({})
    }
}