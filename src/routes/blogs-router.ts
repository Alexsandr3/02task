import {Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {pageValidations, blogsValidations} from "../middlewares/blogs-validation-middleware";
import {BlogsViewType, SortDirectionType} from "../types/blogs_types";
import {prePostsValidationByBlogId} from "../middlewares/posts-validation-middleware";
import {checkBlogIdValidForMongodb, checkIdValidForMongodb} from "../middlewares/check-valid-id-from-db";
import {PostsViewType} from "../types/posts_types";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQeury,
    RequestWithQeury
} from "../types/Req_types";
import {BodyParams_BlogInputModel} from "../models/BodyParams_BlogInputModel";
import {QueryParams_GetBlogsModel} from "../models/QueryParams_GetBlogsModel";
import {BodyParams_BlogPostInputModel} from "../models/BodyParams_BlogPostInputModel";
import {QeuryParams_GetPostsModel} from "../models/QeuryParams_GetPostsModel";
import {URIParams_BlogModel} from "../models/URIParams_BlogModel";
import {blogsQueryRepositories} from "../repositories/blogs-query-repositories";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {PaginatorType} from "../models/PaginatorType";


export const blogsRoute = Router({})


blogsRoute.get('/', pageValidations, async (req: RequestWithQeury<QueryParams_GetBlogsModel>, res: Response<PaginatorType<BlogsViewType[]>>) => {
    let data = req.query
    let dataForReposit = {
        searchNameTerm: '',
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: SortDirectionType.Desc,
        ...data,
    }
    const blogs = await blogsQueryRepositories.findBlogs(dataForReposit)
    res.send(blogs)
})
blogsRoute.post('/', blogsValidations, async (req: RequestWithBody<BodyParams_BlogInputModel>, res: Response<BlogsViewType>) => {
    const newBlog = await blogsService.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
    return res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
})
blogsRoute.get('/:id', checkIdValidForMongodb, async (req: RequestWithParams<URIParams_BlogModel>, res: Response<BlogsViewType>) => {
    const blog = await blogsQueryRepositories.findBlogById(req.params.id)
    if (!blog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    return res.send(blog)
})
blogsRoute.get('/:blogId/posts', checkBlogIdValidForMongodb, pageValidations, async (req: RequestWithParamsAndQeury<{ blogId: string }, QeuryParams_GetPostsModel>, //+++
                                                                                     res: Response<PaginatorType<PostsViewType[]>>) => {
    let data = req.query
    let blogId = req.params.blogId
    let dataForReposit = {
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: SortDirectionType.Desc,
        ...data,
    }
    const posts = await blogsQueryRepositories.findPostsByIdBlog(blogId, dataForReposit)
    if (!posts) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    return res.send(posts)
})
blogsRoute.post('/:blogId/posts', prePostsValidationByBlogId, async (req: RequestWithParamsAndBody<{ blogId: string }, BodyParams_BlogPostInputModel>, res: Response<PostsViewType>) => {
    const blogId = req.params.blogId
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const PostCreated = await blogsService.createPostsByIdBlog(blogId, title, shortDescription, content)
    if (!PostCreated) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    return res.status(HTTP_STATUSES.CREATED_201).send(PostCreated)
})
blogsRoute.put('/:id', checkIdValidForMongodb, blogsValidations, async (req: RequestWithParamsAndBody<URIParams_BlogModel, BodyParams_BlogInputModel>, res: Response) => {
    const id = req.params.id
    let name = req.body.name
    let description = req.body.description
    let websiteUrl = req.body.websiteUrl
    const blog = await blogsService.updateBlogById(id, name, description, websiteUrl)
    if (!blog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
blogsRoute.delete('/:id', checkAutoritionMiddleware, checkIdValidForMongodb, async (req: RequestWithParams<URIParams_BlogModel>, res: Response) => {
    const id = req.params.id
    const isDelete = await blogsService.deleteBlogById(id)
    if (!isDelete) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    } else {
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    }
})