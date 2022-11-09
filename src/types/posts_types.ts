import {paginatorBlogType} from "./blogs_types";
import {ObjectId} from "mongodb";

export  type PostsViewType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type PostsDBType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type ForFindPostsType = Omit<paginatorBlogType, "searchNameTerm">


