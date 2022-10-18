import {Request, Response, Router} from "express";
import {blogs, blogsRepositories} from "../repositories/blogs-repositories";
import {body, CustomValidator, validationResult} from "express-validator";
import {inputValidetionsMiddleware} from "../middlewares/Input-validetions-middleware";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {postsRepositories} from "../repositories/posts-repositories";

export const postsRoute = Router({})

const titleValidation = body('title').isString().notEmpty().trim().isLength({min: 1, max: 30})
const shortDescriptionValidation = body('shortDescription').isString().notEmpty().trim().isLength({min: 1, max: 100})
const contentValidation = body('content').isString().notEmpty().trim().isLength({min: 1, max: 1000})
// const blogIdIsExit: CustomValidator = value => {
//     const searchById = blogsRepositories.searchById(value)
//     if (!searchById) throw new Error()
//     return true;
// }
const blogIdIsExit = body('blogId').isString().notEmpty().trim().custom(value => {
    const searchById = blogsRepositories.searchById(value)
    if (!searchById) throw new Error()
    return true
})

postsRoute.get('/', (req: Request, res: Response) => {
    res.send(blogs)
})
postsRoute.post('/', checkAutoritionMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdIsExit, inputValidetionsMiddleware, (req: Request, res: Response) => {
    const title = req.body.name
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const newPost = postsRepositories.createPost(title,shortDescription,content,blogId)
    return res.status(201).send(newPost)
})
postsRoute.get('/:postId', (req: Request, res: Response) => {
    const post = postsRepositories.searchByIdPost(req.params.postId)
    if (!post) return res.sendStatus(404)
    return res.send(post)
    // if (!post) {
    //     res.sendStatus(404)
    //     return;
    // }
    // res.send(post)
    // return;
})
postsRoute.put('/:postId',checkAutoritionMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdIsExit, inputValidetionsMiddleware, (req: Request, res: Response) => {
    const postId = req.params.postId
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const isPostUpdated = postsRepositories.updatePostById(postId,title,shortDescription,content,blogId)
    if (!isPostUpdated) {
        res.sendStatus(404)
        return;
    }
    return res.sendStatus(204)
})
postsRoute.delete('/:postId', checkAutoritionMiddleware, (req: Request, res: Response) => {
    //const postId = req.params.postId
    const isDelete = postsRepositories.deletePostById(req.params.postId)
    if (!isDelete) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})