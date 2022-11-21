import {PaginatorBlogType} from "./blogs_types";
import {ObjectId} from "mongodb";

/*export  type PostsViewType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}*/

export class PostsViewType {
    constructor(public id: string,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string) {
    }
}

export class PostsDBType {
    constructor(public _id: ObjectId,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string) {

    }
}


export type ForFindPostsType = Omit<PaginatorBlogType, "searchNameTerm">


