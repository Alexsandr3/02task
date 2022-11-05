import {ObjectId} from "mongodb";
import {PostsType} from "./posts_types";
import {UsersType} from "./users_types";


export type BlogsType = {
    _id?: ObjectId
    id?: string
    name: string
    youtubeUrl: string
    createdAt: string
}

export enum SortDirectionType {
    Asc = 'asc',
    Desc = 'desc'
}
export interface ForFindBlogType {
    searchNameTerm: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirectionType
}
export type ForFindPostsByBlogIdType = Omit<ForFindBlogType, "searchNameTerm">

export type TypeForView = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogsType[] | PostsType[] | UsersType[]
}


