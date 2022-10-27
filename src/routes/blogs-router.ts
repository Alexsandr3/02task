import {Request, Response, Router} from "express";
import {blogsRepositories} from "../repositories/blogs-db-repositories";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {preBlogsValidatotion} from "../middlewares/blogs-validation-middleware";


export const blogsRoute = Router({})


blogsRoute.get('/', async (req: Request, res: Response) => {
    const blogs = await blogsRepositories.findBlogs()
    res.send(blogs)
})
blogsRoute.post('/',preBlogsValidatotion,async (req: Request, res: Response) => {
    const name = req.body.name
    const youtubeUrl = req.body.youtubeUrl
    const newBlog = await blogsRepositories.createBlog(name, youtubeUrl)
    return res.status(201).send(newBlog)
})
blogsRoute.get('/:blogId', async (req: Request, res: Response) => {
    const blog = await blogsRepositories.findBlogById(req.params.blogId)
    if (!blog) {
        res.sendStatus(404)
        return;
    }
    return res.send(blog)
})
blogsRoute.put('/:blogId',preBlogsValidatotion, async (req: Request, res: Response) => {
    const id = req.params.blogId
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl
    const blog = await blogsRepositories.updateBlogById(id, name, youtubeUrl)
    if (!blog) {
        res.sendStatus(404)
        return;
    }
    return res.sendStatus(204)
})
blogsRoute.delete('/:blogId',checkAutoritionMiddleware, async (req: Request, res: Response) => {
    const id = req.params.blogId
    const isDelete = await blogsRepositories.deleteBlogById(id)
    if (!isDelete) {
        res.sendStatus(404)
    } else {
        res.send(204)
    }
})