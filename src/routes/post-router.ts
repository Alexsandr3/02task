import {Request, Response, Router} from "express";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {prePostsValidatotion} from "../middlewares/posts-validation-middleware";
import {checkIdValidForMongodb} from "../middlewares/check-valid-id-from-db";
import {SortDirectionType} from "../repositories/blogs-db-repositories";
import {postsService} from "../domain/posts-service";
import {preBlogsPageValidation} from "../middlewares/blogs-validation-middleware";


export const postsRoute = Router({})


postsRoute.get('/', preBlogsPageValidation, async (req: Request, res: Response) => {
    let data = req.query
    let dataForRepos = {
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc' as SortDirectionType,
        ...data,
    }

    console.log('data   = ', data)
    console.log('dataForRepo   = ', dataForRepos)
    const posts = await postsService.findPosts(dataForRepos);
    res.send(posts)
})
postsRoute.post('/', prePostsValidatotion, async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const newPost = await postsService.createPost(title, shortDescription, content, blogId)
    return res.status(201).send(newPost)
})
postsRoute.get('/:id', checkIdValidForMongodb,async (req: Request, res: Response) => {
    const post = await postsService.findByIdPost(req.params.id)
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
    const isPostUpdated = await postsService.updatePostById(postId, title, shortDescription, content, blogId)
    if (!isPostUpdated) {
        res.sendStatus(404)
        return;
    }
    return res.sendStatus(204)
})
postsRoute.delete('/:id', checkAutoritionMiddleware,checkIdValidForMongodb, async (req: Request, res: Response) => {
    const isDelete = await postsService.deletePostById(req.params.id)
    if (!isDelete) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})