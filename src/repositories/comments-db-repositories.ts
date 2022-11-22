import {CommentModelClass, LikeModelClass} from "./schemas";
import {ObjectId} from "mongodb";
import {
    CommentsDBType,
    CommentsViewType,
    LikeDBType,
    LikesInfoViewModel,
    LikeStatusType
} from "../types/comments_types";


export class CommentsRepositories {

    async createStatusCommentById(id: string, userId: string, likeStatus: LikeStatusType): Promise<LikeDBType | boolean> {
        const newStatus = new LikeDBType(
            new ObjectId(),
            userId,
            id,
            likeStatus
        )
        const saveStatus = await LikeModelClass.create(newStatus)
        if (!saveStatus) return false
        return saveStatus
    }

    async createCommentByIdPost(post_id: ObjectId, content: string, userId: string, userLogin: string): Promise<CommentsViewType | null> {
        const newComment = new CommentsDBType(
            new ObjectId(),
            post_id.toString(),
            content,
            userId,
            userLogin,
            new Date().toISOString(),
            [])
        const createComment = await CommentModelClass.create(newComment)
        if (!createComment) return null
        const totalCountLike = await LikeModelClass.countDocuments({_id: createComment._id, likesInfo: "like"})
        const totalCountDislike = await LikeModelClass.countDocuments({commentId: createComment._id, likesInfo: "dislike"})
        const findStatusComment = await LikeModelClass.findOne({userId: userId})
        if (!findStatusComment) return null
        const likesInfo = new LikesInfoViewModel(
            totalCountLike,
            totalCountDislike,
            findStatusComment.likeStatus)
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
