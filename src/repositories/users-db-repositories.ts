import {usersCollection} from "../routes/db";
import {ObjectId} from "mongodb";
import {UsersType} from "../types/users_types";


const userWithNewId = (object: UsersType): UsersType => {
    return {
        id: object._id?.toString(),
        login: object.login,
        email: object.email,
        createdAt: object.createdAt
    }
}


export const usersRepositories = {
    async createUser(user: UsersType): Promise<UsersType> {
        await usersCollection.insertOne(user)
        return userWithNewId(user)
    },
    async deleteUserById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },
    async deleteAll() {
        await usersCollection.deleteMany({})
    }
}