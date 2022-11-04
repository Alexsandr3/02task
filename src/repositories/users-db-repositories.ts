import {usersCollection, UsersType} from "../routes/db";
import {ObjectId} from "mongodb";


const userWithNewId = (object: UsersType): UsersType => {
    return {
        id: object._id?.toString(),
        login: object.login,
        email: object.email,
        createdAt: object.createdAt
    }
}
export type SortDirectionType = 'asc' | 'desc'


export type FindUsersType = {
    searchLoginTerm: string,
    searchEmailTerm: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirectionType
}


export const usersRepositories = {
    async createUser(user: UsersType): Promise<UsersType> {
        await usersCollection.insertOne(user)
        return userWithNewId(user)
    },
    async findUsers(data: FindUsersType): Promise<UsersType[]> {
        return (await usersCollection
            .find({
                $or: [
                    {"email": {$regex: data.searchEmailTerm, $options: 'i'}},
                    {"login": {$regex: data.searchLoginTerm, $options: 'i'}}
                ]
            })
            .skip((data.pageNumber - 1) * data.pageSize)
            .limit(data.pageSize)
            .sort({[data.sortBy]: data.sortDirection})
            .toArray())
            .map(foundUser => userWithNewId(foundUser))
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
    async usersCount(data: FindUsersType): Promise<number> {
        return usersCollection.countDocuments({
            $or: [
                {"email": {$regex: data.searchEmailTerm, $options: 'i'}},
                {"login": {$regex: data.searchLoginTerm, $options: 'i'}}
            ]
        })
    },
    async deleteAll() {
        await usersCollection.deleteMany({})
    }
}