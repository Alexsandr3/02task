import {CommentModelClass, LikeModelClass} from "./schemas";
import {ObjectId} from "mongodb";
import {
    CommentsDBType,
    CommentsViewType,
    LikesInfoViewModel,
    LikeStatusType
} from "../types/comments_types";


export class CommentsRepositories {

    async updateStatusCommentById(id: string, userId: string, likeStatus: LikeStatusType): Promise<boolean> {
        try {
            await LikeModelClass.updateOne(
                {userId: userId, parentId: id},
                {$set: {likeStatus}},
                {upsert: true})
            return true
        } catch (error) {
            return false
        }
    }
    async createCommentByIdPost(post_id: ObjectId, content: string, userId: string, userLogin: string): Promise<CommentsViewType | null> {
        const newComment = new CommentsDBType(
            new ObjectId(),
            post_id.toString(),
            content,
            userId,
            userLogin,
            new Date().toISOString())
        const createComment = await CommentModelClass.create(newComment)
        if (!createComment) return null
        const likesInfo = new LikesInfoViewModel(
            0,
            0,
            LikeStatusType.None)
        return new CommentsViewType(
            newComment._id?.toString(),
            newComment.content,
            newComment.userId,
            newComment.userLogin,
            newComment.createdAt,
            likesInfo)
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
