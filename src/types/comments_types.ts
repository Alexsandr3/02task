import {ObjectId} from "mongodb";


export class CommentsDBType {
    constructor(public _id: ObjectId,  //commentId
                public postId: string,
                public content: string,
                public userId: string,
                public userLogin: string,
                public createdAt: string,
                public likesInfo: LikeDBType[]) {
    }
}

export class CommentsViewType {
    constructor(public id: string,
                public content: string,
                public userId: string,
                public userLogin: string,
                public createdAt: string,
                public likesInfo: LikesInfoViewModel) {
    }
}

export class LikeDBType {
    constructor(public _id: ObjectId,
                public userId: string,
                public parentId: string,
                public likeStatus: string) {
    }
}
export class LikesInfoViewModel {
    constructor(public likesCount: number,
                public dislikesCount: number,
                public myStatus: string) {
    }
}
export enum LikeStatusType {
    None = 'none',
    Like = 'like',
    Dislike = 'dislike'
}


