import {Response, Router} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/Req_types";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {commentsQueryRepositories} from "../repositories/comments-query-repositories";
import {authMiddleware} from "../middlewares/auth-Headers-Validations-Middleware";
import {commentsService} from "../domain/comments-service";
import {preCommentsValidation} from "../middlewares/comments-validation-middleware";
import {checkCommentIdValidForMongodb} from "../middlewares/check-valid-id-from-db";
import {BodyParams_CommentInputModel} from "../models/BodyParams_CommentInputModel";
import {CommentsViewType} from "../types/comments_types";


export const commentsRoute = Router({})


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
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
commentsRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<{id: string}>, res: Response) => {
    const isDelete = await commentsService.deleteCommentById(req.params.id, req.user.id)
    if (isDelete.errorStatus) {
        return res.sendStatus(isDelete.errorStatus)
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
