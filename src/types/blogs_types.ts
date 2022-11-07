import {ObjectId} from "mongodb";


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






