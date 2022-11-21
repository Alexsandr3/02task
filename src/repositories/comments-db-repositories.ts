import {CommentModelClass} from "./schemas";
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

    async createCommentByIdPost(post_id: ObjectId, content: string, userId: string, userLogin: string): Promise<CommentsViewType> {
        const newComment = new CommentsDBType(
            new ObjectId(),
            post_id.toString(),
            content,
            userId,
            userLogin,
            new Date().toISOString())
        await CommentModelClass.create(newComment)
        //await commentsCollection.insertOne(newComment)
        return this.commentWithNewId(newComment)
    }

    async updateCommentsById(id: string, content: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await CommentModelClass.updateOne({_id: new ObjectId(id)}, {$set: {content: content}})
        //const result = await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: {content: content}})
        return result.matchedCount === 1
    }

    async deleteCommentsById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await CommentModelClass.deleteOne({_id: new ObjectId(id)})
        //const result = await commentsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

    async findCommentsById(id: string) {
        return CommentModelClass.findOne({_id: new ObjectId(id)})
        //return await commentsCollection.findOne({_id: new ObjectId(id)})
    }

}

export const commentsRepositories = new CommentsRepositories()