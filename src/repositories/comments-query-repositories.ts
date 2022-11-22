import {CommentModelClass, LikeModelClass} from "./schemas";
import {CommentsViewType, LikesInfoViewModel, LikeStatusType} from "../types/comments_types";
import {ObjectId} from "mongodb";


export class CommentsQueryRepositories {

    async findComments(commentId: string, userId: string): Promise<CommentsViewType | null> {
        if (!ObjectId.isValid(commentId)) {
            return null
        }
        let myStatus: string = LikeStatusType.None
        if (userId) {
            const res = await LikeModelClass.findOne({userId: userId, parentId: commentId})
            if (res){
                myStatus = res.likeStatus
            }
        }
        const totalCountLike = await LikeModelClass.countDocuments({parentId: commentId, likeStatus: "Like"})
        const totalCountDislike = await LikeModelClass.countDocuments({parentId: commentId, likeStatus: "Dislike"})
        if (!myStatus) return null
        const likesInfo = new LikesInfoViewModel(
            totalCountLike,
            totalCountDislike,
            myStatus)
        const result = await CommentModelClass.findOne({_id: new ObjectId(commentId)})
        if (!result) {
            return null
        } else {
            return new CommentsViewType(
                result._id?.toString(),
                result.content,
                result.userId,
                result.userLogin,
                result.createdAt,
                likesInfo)
        }
    }
}


