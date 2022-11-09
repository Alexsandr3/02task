import {usersCollection} from "../routes/db";
import {ForFindUsersType, MeViewModel, UsersDBType, UsersViewType} from "../types/users_types";
import {TypeForView} from "../models/TypeForView";
import {ObjectId} from "mongodb";


export const userWithNewId = (object: UsersDBType): UsersViewType => {
    return {
        id: object._id?.toString(),
        login: object.login,
        email: object.email,
        createdAt: object.createdAt
    }
}
export const userForGet = (object: UsersDBType): MeViewModel => {
    return {
        email: object.email,
        login: object.login,
        id: object._id?.toString()
    }
}


export const usersQueryRepositories = {
    async findUsers(data: ForFindUsersType): Promise<TypeForView<UsersViewType[]>> {
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