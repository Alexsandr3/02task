import {body} from "express-validator";
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

export const preBlogsValidation = [
    checkAutoritionMiddleware,
    nameValidation,
    youtubeUrlValidation,
    inputValidetionsMiddleware
]
