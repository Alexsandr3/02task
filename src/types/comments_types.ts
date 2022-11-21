import {ObjectId} from "mongodb";


export class CommentsDBType {
    constructor(public _id: ObjectId,
                public postId: string,
                public content: string,
                public userId: string,
                public userLogin: string,
                public createdAt: string) {
    }
}

export class CommentsViewType {
    constructor(public id: string,
                public content: string,
                public userId: string,
                public userLogin: string,
                public createdAt: string) {
    }
}

