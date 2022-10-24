import {Request, Response, Router} from "express";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {body} from "express-validator";
import {inputValidetionsMiddleware} from "../middlewares/Input-validetions-middleware";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {blogsRepositories} from "../repositories/blogs-db-repositories";

export const postsRoute = Router({})

const titleValidation = body('title').isString().notEmpty().trim().isLength({min: 1, max: 30})
const shortDescriptionValidation = body('shortDescription').isString().notEmpty().trim().isLength({min: 1, max: 100})
const contentValidation = body('content').isString().notEmpty().trim().isLength({min: 1, max: 1000})
const blogIdIsExit = body('blogId').isString().notEmpty().trim().custom(async value => {
    const searchById = await blogsRepositories.findBlogById(value)
    console.log('searchById', searchById)
    if (!searchById) throw new Error('Incorect blogId')
    return true
})

const prePostsValidatotion = [
    checkAutoritionMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdIsExit,
    inputValidetionsMiddleware]

postsRoute.get('/', async (req: Request, res: Response) => {
    const posts = await postsRepositories.findPosts();
    res.send(posts)
})
postsRoute.post('/', prePostsValidatotion, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const newPost = await postsRepositories.createPost(title, shortDescription, content, blogId)
    return res.status(201).send(newPost)
})
postsRoute.get('/:postId', async (req: Request, res: Response) => {
    const post = await postsRepositories.findByIdPost(req.params.postId)
    if (!post) return res.sendStatus(404)
    console.log(post)
    return res.send(post)
})
postsRoute.put('/:postId',prePostsValidatotion, async (req: Request, res: Response) => {
    const postId = req.params.postId
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const isPostUpdated = await postsRepositories.updatePostById(postId, title, shortDescription, content, blogId)
    if (!isPostUpdated) {
        res.sendStatus(404)
        return;
    }
    return res.sendStatus(204)
})
postsRoute.delete('/:postId', checkAutoritionMiddleware, async (req: Request, res: Response) => {
    //const postId = req.params.postId
    const isDelete = await postsRepositories.deletePostById(req.params.postId)
    if (!isDelete) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})