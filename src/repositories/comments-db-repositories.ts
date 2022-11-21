import {CommentModelClass} from "./schemas";
import {ObjectId} from "mongodb";
import {CommentsDBType, CommentsViewType} from "../types/comments_types";


export class CommentsRepositories {
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
        return this.commentWithNewId(newComment)
    }

    async updateCommentsById(id: string, content: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await CommentModelClass.updateOne({_id: new ObjectId(id)}, {$set: {content: content}})
        return result.matchedCount === 1
    }

    async deleteCommentsById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await CommentModelClass.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

    async findCommentsById(id: string) {
        return CommentModelClass.findOne({_id: new ObjectId(id)})
    }

}
