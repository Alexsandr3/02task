import {CommentsRepositories} from "../repositories/comments-db-repositories";
import {LikeStatusType} from "../types/comments_types";


type UpdateCommentResult = {
    errorStatus?: number
}

export class CommentsService {

    constructor(protected commentsRepositories: CommentsRepositories) {}

    async updateLikeStatus(id: string, likeStatus: LikeStatusType, userId: string): Promise<boolean> {
        const comment = await this.commentsRepositories.findCommentsById(id)
        if (!comment) return false
        return this.commentsRepositories.updateStatusCommentById(id, userId, likeStatus)
    }

    async updateCommentsById(id: string, content: string, userId: string): Promise<UpdateCommentResult> {
        const comment = await this.commentsRepositories.findCommentsById(id)
        if (!comment) {
            return {
                errorStatus: 404
            }
        }
        if (comment.userId !== userId) {
            return {
                errorStatus: 403
            }
        }
        const result = await this.commentsRepositories.updateCommentsById(id, content)

        if (!result) {
            return {
                errorStatus: 400
            }
        }
        return {}
    }

    async deleteCommentById(id: string, userId: string): Promise<UpdateCommentResult> {
        const comment = await this.commentsRepositories.findCommentsById(id)
        if (!comment) {
            return {
                errorStatus: 404
            }
        }
        if (comment.userId !== userId) {
            return {
                errorStatus: 403
            }
        }
        const result = await this.commentsRepositories.deleteCommentsById(id)
        if (!result) {
            return {
                errorStatus: 400
            }
        }
        return {}
    }
}

