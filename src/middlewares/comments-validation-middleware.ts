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
        'likeStatus must be a string(like or dislike or none), must not be empty')
        .isString()
        .trim()
        .default('none')

export const preCommentsValidation = [
    contentValidation,
    inputValidetionsMiddleware
]

export const prelikeStatusValidation =[
    likeStatus,
    inputValidetionsMiddleware
]