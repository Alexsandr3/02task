import {ObjectId} from "mongodb";
import {SortDirectionType} from "./blogs_types";


export type UsersType = {
    _id?: ObjectId
    id?: string
    login: string
    email: string
    passwordHash?: string,
    createdAt: string
}

export type ForFindUsersType = {
    searchLoginTerm: string,
    searchEmailTerm: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirectionType
}
