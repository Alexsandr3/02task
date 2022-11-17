import {usersCollection} from "../routes/db";
import {ObjectId} from "mongodb";
import {UsersAcountDBType, UsersViewType} from "../types/users_types";


const userWithNewId = (object: UsersAcountDBType): UsersViewType => {
    return {
        id: object._id.toString(),
        login: object.accountData.login,
        email: object.accountData.email,
        createdAt: object.accountData.createdAt
    }
}


export const usersRepositories = {
    async createUser(newUser: UsersAcountDBType): Promise<UsersViewType> {
        await usersCollection.insertOne(newUser)
        return userWithNewId(newUser)
    },
    async deleteUser(user: UsersAcountDBType) {
        return await usersCollection.deleteOne(user)
    },
    async deleteUserById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<UsersAcountDBType | null> {
        return await usersCollection.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]})
    },
    async findUserByConfirmationCode(confirmationCode: string): Promise<UsersAcountDBType | null> {
        return await usersCollection.findOne({'emailConfirmation.confirmationCode': confirmationCode})
    },
    async updateConfirmation(_id: ObjectId): Promise<boolean> {
        const result = await usersCollection.updateOne({_id: _id}, {$set: {'emailConfirmation.isConfirmation': true}})
        return result.modifiedCount === 1
    },
    async updateCodeConfirmation(_id: ObjectId, code: string, expirationDate: Date): Promise<boolean> {
        const result = await usersCollection.updateOne({_id: _id}, {
            $set: {
                'emailConfirmation.confirmationCode': code,
                "emailConfirmation.expirationDate": expirationDate
            }
        })
        return result.modifiedCount === 1
    },
    async deleteAll() {
        await usersCollection.deleteMany({})
    }
}