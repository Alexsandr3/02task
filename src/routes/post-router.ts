import {Request, Response, Router} from "express";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {prePostsValidation} from "../middlewares/posts-validation-middleware";
import {SortDirectionType} from "../repositories/blogs-db-repositories";
import {postsService} from "../domain/posts-service";
import {pageValidations} from "../middlewares/blogs-validation-middleware";
import {checkIdValidForMongodb} from "../middlewares/check-valid-id-from-db";


export const postsRoute = Router({})


postsRoute.get('/', pageValidations, async (req: Request, res: Response) => {
    let data = req.query
    let dataForRepos = {
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc' as SortDirectionType,
        ...data,
    }
    const posts = await postsService.findPosts(dataForRepos);
    res.send(posts)
})
postsRoute.post('/', prePostsValidation, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const newPost = await postsService.createPost(title, shortDescription, content, blogId)
    return res.status(201).send(newPost)
})
postsRoute.get('/:id', checkIdValidForMongodb, async (req: Request, res: Response) => {
    const post = await postsService.findByIdPost(req.params.id)
    if (!post) return res.sendStatus(404)
    return res.send(post)
})
postsRoute.put('/:id', checkIdValidForMongodb, prePostsValidation, async (req: Request, res: Response) => {
    const postId = req.params.id
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const isPostUpdated = await postsService.updatePostById(postId, title, shortDescription, content, blogId)
    if (!isPostUpdated) {
        res.sendStatus(404)
        return;
    }
    return res.sendStatus(204)
})
postsRoute.delete('/:id', checkIdValidForMongodb, checkAutoritionMiddleware, async (req: Request, res: Response) => {
    const isDelete = await postsService.deletePostById(req.params.id)
    if (!isDelete) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})