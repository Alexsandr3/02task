import {CommentModelClass, LikeModelClass} from "./schemas";
import {CommentsViewType, LikesInfoViewModel, LikeStatusType} from "../types/comments_types";
import {ObjectId} from "mongodb";


export class CommentsQueryRepositories {

    async findComments(id: string, userId: string): Promise<CommentsViewType | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        let myStatus: string = LikeStatusType.None
        if (userId) {
            const res = await LikeModelClass.findOne({userId: userId, parentId: id})
            if (res){
                myStatus = res.likeStatus
            }
        }
        const totalCountLike = await LikeModelClass.countDocuments({parentId: id, likeStatus: "like"})
        const totalCountDislike = await LikeModelClass.countDocuments({parentId: id, likeStatus: "dislike"})
        if (!myStatus) return null
        const likesInfo = new LikesInfoViewModel(
            totalCountLike,
            totalCountDislike,
            myStatus)
        const result = await CommentModelClass.findOne({_id: new ObjectId(id)})
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


