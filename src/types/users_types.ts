import {ObjectId} from "mongodb";
import {SortDirectionType} from "./blogs_types";


export type UsersDBType = {
    _id: ObjectId
    login: string
    email: string
    passwordHash: string,
    createdAt: string
}
export type UsersViewType = {
    id: string
    login: string
    email: string
    createdAt: string
}
export type MeViewModel = {
    email: string
    login: string
    id: string
}
export type paginatorUsersType = {
    searchLoginTerm: string,
    searchEmailTerm: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirectionType
}
