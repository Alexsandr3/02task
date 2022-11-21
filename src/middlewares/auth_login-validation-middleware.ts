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
const emailValidation =
    body('email',
        'should be valid email')
        .isString()
        .notEmpty()
        .trim()
        .isEmail()

const newPasswordValidation =
    body('newPassword',
        'newPassword must be a string, must not be empty, length must be between 6 and 20 characters')
        .isString()
        .notEmpty()
        .trim()
        .isLength({min: 6, max: 20})


export const loginValidations = [
    loginOrEmailValidation,
    passwordValidation,
    inputValidetionsMiddleware
]

export const emailValidations = [
    emailValidation,
    inputValidetionsMiddleware
]
export const passwordValidations = [
    newPasswordValidation,
    inputValidetionsMiddleware
]