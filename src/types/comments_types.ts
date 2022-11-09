import {ObjectId} from "mongodb";



export type CommentsType = {
    _id?: ObjectId
    id?: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}
