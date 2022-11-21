import {commentsCollection} from "./db";

import {CommentsDBType, CommentsViewType} from "../types/comments_types";
import {ObjectId} from "mongodb";


class CommentsQueryRepositories {

    private commentWithNewId(object: CommentsDBType): CommentsViewType {
        return new CommentsViewType(
            object._id?.toString(),
            object.content,
            object.userId,
            object.userLogin,
            object.createdAt)
    }

    async findComments(id: string): Promise<CommentsViewType | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const result = await commentsCollection.findOne({_id: new ObjectId(id)})
        if (!result) {
            return null
        } else {
            return this.commentWithNewId(result)
        }
    }
}

export const commentsQueryRepositories = new CommentsQueryRepositories()