import {body, query} from "express-validator";
import {checkAutoritionMiddleware} from "./check-autorition-middleware";
import {inputValidetionsMiddleware} from "./Input-validetions-middleware";

const nameValidation =
    body('name',
        'name must be a string, must not be empty, length must be between 1 and 15 characters').
    isString().notEmpty().trim().isLength({min:1, max:15})
const youtubeUrlValidation =
    body('youtubeUrl',
        'should be valid URL, length from 1 to 100 symbol').
    isURL().isLength({min: 1, max: 100})
const pageNumberValidation =
    query('pageNumber',
        'pageNumber must be a number')
        .toInt()
const pageSizeValidation =
    query('pageSize',
        'pageSize must be a number')
        .toInt()

export const preBlogsValidation = [
    checkAutoritionMiddleware,
    nameValidation,
    youtubeUrlValidation,
    inputValidetionsMiddleware
]
export const preBlogsPageValidation = [
    pageNumberValidation,
    pageSizeValidation
]
