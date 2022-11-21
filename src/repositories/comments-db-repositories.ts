import {commentsCollection} from "./db";
import {ObjectId} from "mongodb";
import {CommentsDBType, CommentsViewType} from "../types/comments_types";


class CommentsRepositories {
    private commentWithNewId(object: CommentsDBType): CommentsViewType {
        return new CommentsViewType(
            object._id?.toString(),
            object.content,
            object.userId,
            object.userLogin,
            object.createdAt)
    }

    async createCommentByIdPost(_id: ObjectId, content: string, userId: string, userLogin: string): Promise<CommentsViewType> {
        const newComment = new CommentsDBType(
            new ObjectId(),
            _id.toString(),
            content,
            userId,
            userLogin,
            new Date().toISOString())
        await commentsCollection.insertOne(newComment)
        return this.commentWithNewId(newComment)
    }

    async updateCommentsById(id: string, content: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: {content: content}})
        return result.matchedCount === 1
    }

    async deleteCommentsById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await commentsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

    async findCommentsById(id: string) {
        return await commentsCollection.findOne({_id: new ObjectId(id)})
    }

}

export const commentsRepositories = new CommentsRepositories()