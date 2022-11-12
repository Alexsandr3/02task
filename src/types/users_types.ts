import {ObjectId} from "mongodb";
import {SortDirectionType} from "./blogs_types";


export interface UsersDBType  {
    _id: ObjectId
    login: string
    email: string
    passwordHash: string,
    createdAt: string
}
export type AccountDataType = Omit<UsersDBType, "_id">

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
export type EmailConfirmationType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmation: boolean
    sentEmails: SentEmailType[]
}
export type UsersAcountDBType = {
    _id: ObjectId
    accountData: AccountDataType
    emailConfirmation: EmailConfirmationType
}
export type SentEmailType ={
    sentDate: Date
}

