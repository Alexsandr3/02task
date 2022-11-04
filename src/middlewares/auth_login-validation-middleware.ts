import {body} from "express-validator";
import {inputValidetionsMiddleware} from "./Input-validetions-middleware";


const loginValidation =
    body('login',
        'login must be a string, must not be empty, length must be between 3 and 10 characters')
        .isString()
        .notEmpty()
        .trim()
const passwordValidation =
    body('password',
        'password must be a string, must not be empty, length must be between 6 and 20 characters')
        .isString()
        .notEmpty()
        .trim()


export const loginValidations = [
    loginValidation,
    passwordValidation,
    inputValidetionsMiddleware
]