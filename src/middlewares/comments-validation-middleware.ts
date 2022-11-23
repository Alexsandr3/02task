import {body} from "express-validator";
import {inputValidetionsMiddleware} from "./Input-validetions-middleware";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {NextFunction, Request, Response} from "express";

const contentValidation =
    body('content',
        'content must be a string, must not be empty, length must be between 20 and 300 characters')
        .isString()
        .notEmpty()
        .trim()
        .isLength({min: 20, max: 300})
/*const likeStatus =
    body('likeStatus',
        'likeStatus must be a string(like or dislike or none), must not be empty')
        .isString()
        .trim()
        .notEmpty()
        .default('None')*/

export const preCommentsValidation = [
    contentValidation,
    inputValidetionsMiddleware
]

export const validationLikeStatusMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const likeStatus = ['None', 'Like', 'Dislike']
    const foundLikeStatus = likeStatus.includes(req.body.likeStatus)
    if (!foundLikeStatus) {
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            "errorsMessages": [
                {
                    "message": "Incorrect likeStatus",
                    "field": "likeStatus"
                }
            ]
        })
    }
    next()
}




