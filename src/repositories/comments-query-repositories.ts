import {commentsCollection} from "../routes/db";

import {CommentsType} from "../types/comments_types";
import {ObjectId} from "mongodb";


export const commentWithNewId = (object: CommentsType): CommentsType => {
    return {
        id: object._id?.toString(),
        content: object.content,
        userId: object.userId,
        userLogin: object.userLogin,
        createdAt: object.createdAt,
    }
}

export const commentsQueryRepositories = {
    async findComments(id: string): Promise<CommentsType | null> {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const result = await commentsCollection.findOne({_id:new ObjectId(id)})
        if (!result){
            return null
        } else {
            return commentWithNewId(result)
        }
    }
}