import {body, query} from "express-validator";
import {checkAutoritionMiddleware} from "./check-autorition-middleware";
import {inputValidetionsMiddleware} from "./Input-validetions-middleware";
import exp from "constants";


const loginValidation =
    body('login',
        'login must be a string, must not be empty, length must be between 3 and 10 characters')
        .isString()
        .notEmpty()
        .trim()
        .isLength({min:3, max:10})
const passwordValidation =
    body('password',
        'password must be a string, must not be empty, length must be between 6 and 20 characters')
        .isString()
        .notEmpty()
        .trim()
        .isLength({min:6, max:20})
const emailValidation =
    body('email',
        'should be valid email')
        .isString()
        .notEmpty()
        .trim()
        .isEmail()
const pageNumberValidation =
    query('pageNumber',
        'pageNumber must be a number')
        .toInt()
        .default(1)
const pageSizeValidation =
    query('pageSize',
        'pageSize must be a number')
        .toInt()
        .default(10)

export const preUsersValidations =[
    checkAutoritionMiddleware,
    pageNumberValidation,
    pageSizeValidation,
    inputValidetionsMiddleware
]


export const usersValidations = [
    checkAutoritionMiddleware,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidetionsMiddleware
]