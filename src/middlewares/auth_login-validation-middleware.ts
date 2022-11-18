import {body} from "express-validator";
import {inputValidetionsMiddleware} from "./Input-validetions-middleware";


const loginOrEmailValidation =
    body('loginOrEmail',
        'loginOrEmail must be a string, must not be empty')
        .isString()
        .notEmpty()
        .trim()
const passwordValidation =
    body('password',
        'password must be a string, must not be empty')
        .isString()
        .notEmpty()
        .trim()


export const loginValidations = [
    loginOrEmailValidation,
    passwordValidation,
    inputValidetionsMiddleware
]