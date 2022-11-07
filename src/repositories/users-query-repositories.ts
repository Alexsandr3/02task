import {usersCollection} from "../routes/db";
import {ForFindUsersType, UsersType} from "../types/users_types";
import {TypeForView} from "../models/TypeForView";


const userWithNewId = (object: UsersType): UsersType => {
    return {
        id: object._id?.toString(),
        login: object.login,
        email: object.email,
        createdAt: object.createdAt
    }
}


export const usersQueryRepositories = {
    async findUsers(data: ForFindUsersType): Promise<TypeForView<UsersType[]>> {
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
    }
}