import {usersCollection} from "../routes/db";
import {paginatorUsersType, MeViewModel, UsersViewType, UsersAcountDBType} from "../types/users_types";
import {PaginatorType} from "../models/PaginatorType";
import {ObjectId} from "mongodb";


export const userWithNewId = (object: UsersAcountDBType): UsersViewType => {
    return {
        id: object._id?.toString(),
        login: object.accountData.login,
        email: object.accountData.email,
        createdAt: object.accountData.createdAt
    }
}
export const userForGet = (object: UsersAcountDBType): MeViewModel => {
    return {
        email: object.accountData.email,
        login: object.accountData.login,
        id: object._id?.toString()
    }
}


export const usersQueryRepositories = {
    async findUsers(data: paginatorUsersType): Promise<PaginatorType<UsersViewType[]>> {
        const foundsUsers = (await usersCollection
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
        const totalCount = await usersCollection.countDocuments({
            $or: [
                {"email": {$regex: data.searchEmailTerm, $options: 'i'}},
                {"login": {$regex: data.searchLoginTerm, $options: 'i'}}
            ]
        })
        const pagesCountRes = Math.ceil(totalCount / data.pageSize)
        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: totalCount,
            items: foundsUsers //exchange \\ items: foundsUsers ? foundsUsers : []
        }
    },
    async findUserById(id: string) {
        const result = await usersCollection.findOne({_id: new ObjectId(id)})
        if (!result) {
            return null
        } else {
            return userWithNewId(result)
        }
    },
    async getUserById(id: string) {
        const result = await usersCollection.findOne({_id: new ObjectId(id)})

        if (!result) {
            return null
        } else {
            return userForGet(result)
        }
    }
}