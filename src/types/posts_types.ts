import {ForFindBlogType} from "./blogs_types";
import {ObjectId} from "mongodb";

export  type PostsType = {
    _id?: ObjectId
    id?: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type ForFindPostsType = Omit<ForFindBlogType, "searchNameTerm">


