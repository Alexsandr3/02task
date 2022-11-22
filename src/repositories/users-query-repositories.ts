import {paginatorUsersType, MeViewModel, UsersViewType, UsersAcountDBType} from "../types/users_types";
import {PaginatorType} from "../types/PaginatorType";
import {ObjectId} from "mongodb";
import {UserModelClass} from "./schemas";

export const userWithNewId = (object: UsersAcountDBType): UsersViewType => {
    return new UsersViewType(
        object._id?.toString(),
        object.accountData.login,
        object.accountData.email,
        object.accountData.createdAt
    )
}
export const userForGet = (object: UsersAcountDBType): MeViewModel => {
    return new MeViewModel(
        object.accountData.email,
        object.accountData.login,
        object._id?.toString()
    )
}

export class UsersQueryRepositories {
    async findUsers(data: paginatorUsersType): Promise<PaginatorType<UsersViewType[]>> {
        const foundsUsers = (await UserModelClass
            .find({
                $or: [
                    {"accountData.email": {$regex: data.searchEmailTerm, $options: 'i'}},
                    {"accountData.login": {$regex: data.searchLoginTerm, $options: 'i'}}
                ]
            })
            .skip((data.pageNumber - 1) * data.pageSize)
            .limit(data.pageSize)
            .sort({[data.sortBy]: data.sortDirection})
            .lean())
            .map(foundUser => userWithNewId(foundUser))
        const totalCount = await UserModelClass.countDocuments({
            $or: [
                {"accountData.email": {$regex: data.searchEmailTerm, $options: 'i'}},
                {"accountData.login": {$regex: data.searchLoginTerm, $options: 'i'}}
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

    async findUserById(id: string): Promise<UsersViewType | null> {
        const result = await UserModelClass.findOne({_id: new ObjectId(id)})
        if (!result) {
            return null
        } else {
            return userWithNewId(result)
        }
    }

    async getUserById(id: string): Promise<MeViewModel | null> {
        const result = await UserModelClass.findOne({_id: new ObjectId(id)})
        if (!result) {
            return null
        } else {
            return userForGet(result)
        }
    }
}

