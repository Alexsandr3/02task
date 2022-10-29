import {Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {preBlogsPageValidation, preBlogsValidation} from "../middlewares/blogs-validation-middleware";
import {checkIdValidForMongodb} from "../middlewares/check-valid-id-from-db";
import {SortDirectionType} from "../repositories/blogs-db-repositories";
import { prePostsValidatotionByBlogId} from "../middlewares/posts-validation-middleware";



export const blogsRoute = Router({})


blogsRoute.get('/', preBlogsPageValidation, async (req: Request, res: Response) => {
    let data = req.query
    let dataForRepo = {
        searchNameTerm: null,
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc' as SortDirectionType,
        ...data,
    }
    const blogs = await blogsService.findBlogs(dataForRepo)
    res.send(blogs)
})
blogsRoute.post('/',preBlogsValidation,async (req: Request, res: Response) => {
    const newBlog = await blogsService.createBlog(req.body.name, req.body.youtubeUrl)
    return res.status(201).send(newBlog)
})
blogsRoute.get('/:id', checkIdValidForMongodb, async (req: Request, res: Response) => {
    const blog = await blogsService.findBlogById(req.params.id)
    if (!blog) {
        res.sendStatus(404)
        return;
    }
    return res.send(blog)
})
blogsRoute.get('/:blogId/posts', preBlogsPageValidation, async (req: Request, res: Response) => {
    let data = req.query
    let blogId = req.params.blogId
    let dataForRepo = {
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc' as SortDirectionType,
        ...data,
    }
    const blog = await blogsService.findPostsByIdBlog(blogId, dataForRepo)
    if (!blog) {
        res.sendStatus(404)
        return;
    }
    return res.send(blog)
})
blogsRoute.post('/:blogId/posts',prePostsValidatotionByBlogId, async (req: Request, res: Response) => {
    const blogId = req.params.blogId
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const isPostUpdated = await blogsService.createPostsByIdBlog(blogId, title, shortDescription, content)

    if (!isPostUpdated) {
        res.sendStatus(404)
        return;
    }
    return res.sendStatus(204)
})
blogsRoute.put('/:id',preBlogsValidation,checkIdValidForMongodb, async (req: Request, res: Response) => {
    const id = req.params.id
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl
    const blog = await blogsService.updateBlogById(id, name, youtubeUrl)
    if (!blog) {
        res.sendStatus(404)
        return;
    }
    return res.sendStatus(204)
})
blogsRoute.delete('/:id',checkAutoritionMiddleware,checkIdValidForMongodb, async (req: Request, res: Response) => {
    const id = req.params.id
    const isDelete = await blogsService .deleteBlogById(id)
    if (!isDelete) {
        res.sendStatus(404)
    } else {
        res.send(204)
    }
})