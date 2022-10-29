import {body} from "express-validator";
import {blogsRepositories} from "../repositories/blogs-db-repositories";
import {checkAutoritionMiddleware} from "./check-autorition-middleware";
import {inputValidetionsMiddleware} from "./Input-validetions-middleware";
import {checkIdValidForMongodb} from "./check-valid-id-from-db";

const titleValidation =
    body('title',
        'title must be a string, must not be empty, length must be between 1 and 30 characters').
    isString().notEmpty().trim().isLength({min:1, max:30})
const shortDescriptionValidation =
    body('shortDescription',
        'shortDescription must be a string, must not be empty, length must be between 1 and 100 characters').
    isString().notEmpty().trim().isLength({min:1, max:100})
const contentValidation =
    body('content',
        'content must be a string, must not be empty, length must be between 1 and 1000 characters').
    isString().notEmpty().trim().isLength({min:1, max:1000})
const blogIdIsExit =
    body('blogId',
        'blogId must be a string, must not be empty, blogId should be valid').
    isString().notEmpty().trim().custom(async value => {
        const searchById = await blogsRepositories.findBlogById(value)
        console.log('searchById', searchById)
        if (!searchById) throw new Error('Incorrect blogId')
        return true
    })

export const prePostsValidation = [
    checkAutoritionMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdIsExit,
    inputValidetionsMiddleware]
export const prePostsValidationByBlogId = [
    checkAutoritionMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    checkIdValidForMongodb,
    inputValidetionsMiddleware]
