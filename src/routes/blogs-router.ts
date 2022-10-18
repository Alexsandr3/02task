import {Request, Response, Router} from "express";
import {blogs, blogsRepositories} from "../repositories/blogs-repositories";
import {body, validationResult} from "express-validator";
import {inputValidetionsMiddleware} from "../middlewares/Input-validetions-middleware";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";

export const blogsRoute = Router({})

const nameValidation =  body('name').isString().notEmpty().trim().isLength({min:1, max:15})
const youtubeUrlValidation = body('youtubeUrl').isURL().isLength({min: 1, max: 100})


blogsRoute.get('/', (req: Request, res: Response) => {
    res.send(blogs)
})
blogsRoute.post('/',checkAutoritionMiddleware,nameValidation,youtubeUrlValidation,inputValidetionsMiddleware,(req: Request, res: Response) => {
    const name = req.body.name
    const youtubeUrl = req.body.youtubeUrl
    const newBlog =blogsRepositories.createBlog(name, youtubeUrl)
    res.status(201).send(newBlog)
})
blogsRoute.get('/:blogId', (req: Request, res: Response) => {
    const blog =blogsRepositories.searchById(req.params.blogId)
    if (!blog){
        res.sendStatus(404)
        return;
    }
    res.send(blog)
})
blogsRoute.put('/:blogId',checkAutoritionMiddleware,nameValidation,youtubeUrlValidation,inputValidetionsMiddleware, (req: Request, res: Response) => {
    const id = req.params.blogId
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl
    const blog = blogsRepositories.updateBlogById(id,name,youtubeUrl)
    if (!blog){
        res.sendStatus(404)
        return;
    }
    res.sendStatus(204)
})
blogsRoute.delete('/:blogId',checkAutoritionMiddleware, (req: Request, res: Response) => {
    const id = req.params.blogId
    const isDelete = blogsRepositories.deleteBlogById(id)
    if (!isDelete){
        res.sendStatus(404)
    } else {
        res.send(204)
    }
})