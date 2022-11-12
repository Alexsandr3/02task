import {body, query} from "express-validator";
import {checkAutoritionMiddleware} from "./check-autorition-middleware";
import {inputValidetionsMiddleware} from "./Input-validetions-middleware";


const nameValidation =
    body('name',
        'name must be a string, must not be empty, length must be between 1 and 15 characters')
        .isString()
        .notEmpty()
        .trim()
        .isLength({min:1, max:15})

const youtubeUrlValidation =
    body('youtubeUrl',
        'should be valid URL, length from 1 to 100 symbol')
        .isURL()
        .isLength({min: 1, max: 100})
        //.matches(/^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)




const pageNumberValidation =
    query('pageNumber',
        'pageNumber must be a number')
        .toInt()
        .default(1)

const pageSizeValidation =
    query('pageSize',
        'pageSize must be a number')
        .toInt().optional()
        .default(10)

const sortByValidation =
    query('sortBy',
        'sortBy must be a string and the option to sort by is selected (`id`, `name`, `youtubeUrl`, `createdAt`)')
        .isString()
        .notEmpty()
        .trim().optional()
        .default('createdAt')

const sortDirectionValidation =
    query('sortDirection',
        'sortDirection must be a `asc` or `desc`')
        .isString()
        .notEmpty()
        .trim().optional()
        .default('desc')

export const blogsValidations = [
    checkAutoritionMiddleware,
    nameValidation,
    youtubeUrlValidation,
    inputValidetionsMiddleware
]
export const pageValidations = [
    pageNumberValidation,
    pageSizeValidation,
    sortByValidation,
    sortDirectionValidation,
    inputValidetionsMiddleware
]
