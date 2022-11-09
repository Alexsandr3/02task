import {ObjectId} from "mongodb";


export type CommentsDBType = {
    _id: ObjectId
    content: string
    userId: string
    userLogin: string
    createdAt: string
}
export type CommentsViewType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}
