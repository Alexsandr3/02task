import {CommentModelClass, LikeModelClass} from "./schemas";
import {CommentsViewType, LikesInfoViewModel} from "../types/comments_types";
import {ObjectId} from "mongodb";


export class CommentsQueryRepositories {

    async findComments(id: string): Promise<CommentsViewType | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const totalCountLike = await LikeModelClass.countDocuments({parentId: id, likeStatus: "like"})
        const totalCountDislike = await LikeModelClass.countDocuments({parentId: id, likeStatus: "dislike"})
        const myStatus = await LikeModelClass.findOne({commentId: id})
        if (!myStatus) return null
        const likesInfo = new LikesInfoViewModel(
            totalCountLike,
            totalCountDislike,
            myStatus.likeStatus)
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


