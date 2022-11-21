import {ObjectId} from "mongodb";


export class BlogsViewType {
    constructor(public id: string,
                public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string) {
    }
}

export class BlogsDBType {
    constructor(public _id: ObjectId,
                public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string
    ) {}
}

export enum SortDirectionType {
    Asc = 'asc',
    Desc = 'desc'
}

/*export class PaginatorBlogType {
    constructor(public searchNameTerm: string,
                public pageNumber: number,
                public pageSize: number,
                public sortBy: string,
                public sortDirection: SortDirectionType) {
    }
}*/

export interface PaginatorBlogType {
    searchNameTerm: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirectionType
}

export type PaginatorPostsBlogType = Omit<PaginatorBlogType, "searchNameTerm">



