import {ObjectId} from "mongodb";


export type BlogsViewType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export type BlogsDBType = {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export enum SortDirectionType {
    Asc = 'asc',
    Desc = 'desc'
}
export interface paginatorBlogType {
    searchNameTerm: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirectionType
}

export type PaginatorPostsBlogType = Omit<paginatorBlogType, "searchNameTerm">






