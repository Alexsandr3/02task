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

export class UsersViewType {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public createdAt: string,
    ) {
    }
}

export type MeViewModel = {
    email: string
    login: string
    userId: string
}
export type paginatorUsersType = {
    searchLoginTerm: string,
    searchEmailTerm: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirectionType
}

export class EmailConfirmationType {
    constructor(public confirmationCode: string,
                public expirationDate: Date,
                public isConfirmation: boolean,
                public sentEmails: SentEmailType[]) {
    }
}

export class EmailRecoveryType {
    constructor(public recoveryCode: string,
                public expirationDate: Date,
                public isConfirmation: boolean,
                public sentEmails: SentEmailType[]) {
    }
}

export class UsersAcountDBType {
    constructor(public _id: ObjectId,
                public accountData: AccountDataType,
                public emailConfirmation: EmailConfirmationType,
                public emailRecovery: EmailRecoveryType) {
    }
}

export class SentEmailType {
    constructor(public sentDate: Date) {
    }
}


