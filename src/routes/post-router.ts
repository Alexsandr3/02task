import {Request, Response, Router} from "express";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {prePostsValidatotion} from "../middlewares/posts-validation-middleware";
import {checkIdValidForMongodb} from "../middlewares/check-valid-id-from-db";


export const postsRoute = Router({})


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
postsRoute.get('/:id', checkIdValidForMongodb,async (req: Request, res: Response) => {
    const post = await postsRepositories.findByIdPost(req.params.id)
    if (!post) return res.sendStatus(404)
    console.log(post)
    return res.send(post)
})
postsRoute.put('/:id',prePostsValidatotion,checkIdValidForMongodb, async (req: Request, res: Response) => {
    const postId = req.params.id
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
postsRoute.delete('/:id', checkAutoritionMiddleware,checkIdValidForMongodb, async (req: Request, res: Response) => {
    const isDelete = await postsRepositories.deletePostById(req.params.id)
    if (!isDelete) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})