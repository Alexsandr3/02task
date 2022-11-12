import {body, query} from "express-validator";
import {checkAutoritionMiddleware} from "./check-autorition-middleware";
import {inputValidetionsMiddleware} from "./Input-validetions-middleware";
import {usersRepositories} from "../repositories/users-db-repositories";




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

export const emailValidation =
    body('email',
        'should be valid email')
        .isString()
        .notEmpty()
        .trim()
        .isEmail()
        .custom(async (loginOrEmail) => {
        const isValidUser = await usersRepositories.findByLoginOrEmail(loginOrEmail)
        if (isValidUser) throw new Error('E-mail already in use')
        return
    })

export const pageNumberValidation =
    query('pageNumber',
        'pageNumber must be a number')
        .toInt()
        .default(1)

export const pageSizeValidation =
    query('pageSize',
        'pageSize must be a number')
        .toInt()
        .default(10)

const sortByValidation =
    query('sortBy',
        'sortBy must be a string and the option to sort by is selected (`id`, `login`, `email`, `createdAt`)')
        .isString()
        .notEmpty()
        .trim().optional()
        .default('createdAt')

const sortDirectionValidation =
    query('sortDirection',
        'sortDirection must be a `asc` or `desc`')
        .isString()
        .notEmpty()
        .trim()

        .optional()  //// ???????
        .default('desc')   //// ???????






export const preGetUsersValidations =[
    sortByValidation,
    sortDirectionValidation,
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
export const usersAccountValidations = [
    emailValidation,
    loginValidation,
    passwordValidation,
    inputValidetionsMiddleware
]