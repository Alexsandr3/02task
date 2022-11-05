import {ObjectId} from "mongodb";

export type BlogsViewModel = {
    _id: ObjectId
    name: string
    youtubeUrl: string
    createdAt: string
}

