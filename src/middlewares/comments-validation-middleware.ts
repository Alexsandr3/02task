import {body} from "express-validator";
import {inputValidetionsMiddleware} from "./Input-validetions-middleware";

const contentValidation =
    body('content',
        'content must be a string, must not be empty, length must be between 20 and 300 characters')
        .isString()
        .notEmpty()
        .trim()
        .isLength({min: 20, max: 300})
const likeStatus =
    body('likeStatus',
        'likeStatus must be a string(Like or Dislike or None), must not be empty')
        .isString()
        .trim()
        .notEmpty()
        .default('None')
        .isIn(['None', 'Like', 'Dislike'])


export const preCommentsValidation = [
    contentValidation,
    inputValidetionsMiddleware
]

export const validationLikeStatusMiddleware = [
    likeStatus,
    inputValidetionsMiddleware
]
/*

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
*/




