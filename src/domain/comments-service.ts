import {commentsRepositories} from "../repositories/comments-db-repositories";



type UpdateCommentResult = {
    errorStatus?: number
}

export const commentsService = {
    async updateCommentsById (id: string, content: string, userId: string): Promise<UpdateCommentResult> {
        const comment = await commentsRepositories.findCommentsById(id)
        if(!comment) {
            return  {
                errorStatus: 404
            }
        }
        if(comment.userId !== userId) {
            return {
                errorStatus: 403
            }
        }
        const result = await commentsRepositories.updateCommentsById(id, content)

        if(!result) {
            return {
                errorStatus: 400
            }
        }
        return { }
    },
    async deleteCommentById (id: string, userId: string): Promise<UpdateCommentResult>{
        const comment = await commentsRepositories.findCommentsById(id)
        if(!comment) {
            return  {
                errorStatus: 404
            }
        }
        if(comment.userId !== userId) {
            return {
                errorStatus: 403
            }
        }
        const result = await commentsRepositories.deleteCommentsById(id)
        if(!result) {
            return {
                errorStatus: 500
            }
        }
        return {}
    }
}