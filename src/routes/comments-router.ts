import {Response, Router} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/Req_types";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {authMiddleware} from "../middlewares/auth-Headers-Validations-Middleware";
import {preCommentsValidation, prelikeStatusValidation} from "../middlewares/comments-validation-middleware";
import {checkCommentIdValidForMongodb} from "../middlewares/check-valid-id-from-db";
import {BodyParams_CommentInputModel} from "../models/BodyParams_CommentInputModel";
import {CommentsViewType} from "../types/comments_types";
import {commentsQueryRepositories, commentsService} from "../composition-root";
import {BodyParams_LikeInputModel} from "../models/BodyParams_LikeInputModel";


export const commentsRoute = Router({})


commentsRoute.put('/:id/like-status', authMiddleware, prelikeStatusValidation, async (req: RequestWithParamsAndBody<{ id: string }, BodyParams_LikeInputModel>, res: Response) => {
    const result = await commentsService.updateLikeStatus(req.params.id, req.body.likeStatus)
    if (!result) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
commentsRoute.get('/:id', checkCommentIdValidForMongodb, async (req: RequestWithParams<{id: string}>, res: Response<CommentsViewType>) => {
    const comments = await commentsQueryRepositories.findComments(req.params.id)
    if (!comments) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    return res.send(comments)
})
commentsRoute.put('/:id', authMiddleware, preCommentsValidation, async (req: RequestWithParamsAndBody<{id: string},BodyParams_CommentInputModel>, res: Response) => {
    const result = await commentsService.updateCommentsById(req.params.id, req.body.content, req.user.id)
    if (result.errorStatus) {
        return res.sendStatus(result.errorStatus)
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
commentsRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<{id: string}>, res: Response) => {
    const isDelete = await commentsService.deleteCommentById(req.params.id, req.user.id)
    if (isDelete.errorStatus) {
        return res.sendStatus(isDelete.errorStatus)
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
