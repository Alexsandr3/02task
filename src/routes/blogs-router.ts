import { Response, Router} from "express";
import {blogsService, BlogsTypeForService, BlogsTypeForServicePost} from "../domain/blogs-service";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {pageValidations, blogsValidations} from "../middlewares/blogs-validation-middleware";
import {SortDirectionType} from "../repositories/blogs-db-repositories";
import {prePostsValidationByBlogId} from "../middlewares/posts-validation-middleware";
import {checkBlogIdValidForMongodb, checkIdValidForMongodb} from "../middlewares/check-valid-id-from-db";
import {BlogsType, PostsType} from "./db";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQeury,
    RequestWithQeury
} from "../types";
import {BodyParams_CreateAndUpdateBlogModel} from "../models/BodyParams_CreateAndUpdateBlogModel";
import {QueryParams_GetBlogsModel} from "../models/QueryParams_GetBlogsModel";
import {BodyParams_FindBlogByIdAndCreatePostModel} from "../models/BodyParams_FindBlogByIdAndCreatePostModel";
import {QeuryParams_GetPostsModel} from "../models/QeuryParams_GetPostsModel";
import {URIParams_BlogModel} from "../models/URIParams_BlogModel";


export const blogsRoute = Router({})


blogsRoute.get('/', pageValidations, async (req: RequestWithQeury<QueryParams_GetBlogsModel>, res: Response<BlogsTypeForService>) => {
    let data = req.query
    let dataForReposit = {
        searchNameTerm: '',
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: SortDirectionType.Desc,
        ...data,
    }
    const blogs = await blogsService.findBlogs(dataForReposit)
    res.send(blogs)
})
blogsRoute.post('/', blogsValidations, async (req: RequestWithBody<BodyParams_CreateAndUpdateBlogModel>,res: Response<BlogsType>) => {
    const newBlog = await blogsService.createBlog(req.body.name, req.body.youtubeUrl)
    return res.status(201).send(newBlog)
})
blogsRoute.get('/:id', checkIdValidForMongodb, async (req: RequestWithParams<URIParams_BlogModel>, res: Response<BlogsType>) => {
    const blog = await blogsService.findBlogById(req.params.id)
    if (!blog) {
        res.sendStatus(404)
        return;
    }
    return res.send(blog)
})
blogsRoute.get('/:blogId/posts', checkBlogIdValidForMongodb, pageValidations, async (req: RequestWithParamsAndQeury<{blogId: string},QeuryParams_GetPostsModel>,
                                                                                     res: Response<BlogsTypeForServicePost>) => {
    let data = req.query
    let blogId = req.params.blogId
    let dataForReposit = {
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: SortDirectionType.Desc,
        ...data,
    }
    const posts = await blogsService.findPostsByIdBlog(blogId, dataForReposit)
    if (!posts) {
        res.sendStatus(404)
        return;
    }
    return res.send(posts)
})
blogsRoute.post('/:blogId/posts',prePostsValidationByBlogId, async (req: RequestWithParamsAndBody<{blogId: string},BodyParams_FindBlogByIdAndCreatePostModel>, res: Response<PostsType>) => {
    const blogId = req.params.blogId
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const PostCreated = await blogsService.createPostsByIdBlog(blogId, title, shortDescription, content)
    if (!PostCreated) {
        res.sendStatus(404)
        return;
    }
    return res.status(201).send(PostCreated)
})
blogsRoute.put('/:id', checkIdValidForMongodb, blogsValidations, async (req: RequestWithParamsAndBody<URIParams_BlogModel,BodyParams_CreateAndUpdateBlogModel>, res: Response) => {
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
blogsRoute.delete('/:id', checkAutoritionMiddleware, checkIdValidForMongodb, async (req: RequestWithParams<URIParams_BlogModel>, res: Response) => {
    const id = req.params.id
    const isDelete = await blogsService.deleteBlogById(id)
    if (!isDelete) {
        res.sendStatus(404)
    } else {
        res.send(204)
    }
})