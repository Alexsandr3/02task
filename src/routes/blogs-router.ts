import {Request, Response, Router} from "express";
import {blogsRepositories} from "../repositories/blogs-db-repositories";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {preBlogsValidation} from "../middlewares/blogs-validation-middleware";
import {checkIdValidForMongodb} from "../middlewares/check-valid-id-from-db";


export const blogsRoute = Router({})


blogsRoute.get('/', async (req: Request, res: Response) => {
    const blogs = await blogsRepositories.findBlogs()
    res.send(blogs)
})
blogsRoute.post('/',preBlogsValidation,async (req: Request, res: Response) => {
    const name = req.body.name
    const youtubeUrl = req.body.youtubeUrl
    const newBlog = await blogsRepositories.createBlog(name, youtubeUrl)
    return res.status(201).send(newBlog)
})
blogsRoute.get('/:id', checkIdValidForMongodb, async (req: Request, res: Response) => {
    const blog = await blogsRepositories.findBlogById(req.params.id)
    if (!blog) {
        res.sendStatus(404)
        return;
    }
    return res.send(blog)
})
blogsRoute.put('/:id',preBlogsValidation,checkIdValidForMongodb, async (req: Request, res: Response) => {
    const id = req.params.id
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl
    const blog = await blogsRepositories.updateBlogById(id, name, youtubeUrl)
    if (!blog) {
        res.sendStatus(404)
        return;
    }
    return res.sendStatus(204)
})
blogsRoute.delete('/:id',checkAutoritionMiddleware,checkIdValidForMongodb, async (req: Request, res: Response) => {
    const id = req.params.id
    const isDelete = await blogsRepositories.deleteBlogById(id)
    if (!isDelete) {
        res.sendStatus(404)
    } else {
        res.send(204)
    }
})