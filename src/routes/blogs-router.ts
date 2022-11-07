import { Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {pageValidations, blogsValidations} from "../middlewares/blogs-validation-middleware";
import {BlogsType, SortDirectionType} from "../types/blogs_types";
import {prePostsValidationByBlogId} from "../middlewares/posts-validation-middleware";
import {checkBlogIdValidForMongodb, checkIdValidForMongodb} from "../middlewares/check-valid-id-from-db";
import {PostsType} from "../types/posts_types";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQeury,
    RequestWithQeury
} from "../Req_types";
import {BodyParams_CreateAndUpdateBlogModel} from "../models/BodyParams_CreateAndUpdateBlogModel";
import {QueryParams_GetBlogsModel} from "../models/QueryParams_GetBlogsModel";
import {BodyParams_FindBlogByIdAndCreatePostModel} from "../models/BodyParams_FindBlogByIdAndCreatePostModel";
import {QeuryParams_GetPostsModel} from "../models/QeuryParams_GetPostsModel";
import {URIParams_BlogModel} from "../models/URIParams_BlogModel";
import {blogsQueryRepositories} from "../repositories/blogs-query-repositories";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {TypeForView} from "../models/TypeForView";


export const blogsRoute = Router({})


blogsRoute.get('/', pageValidations, async (req: RequestWithQeury<QueryParams_GetBlogsModel>, res: Response<TypeForView<BlogsType[]>>) => {
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
blogsRoute.post('/', blogsValidations, async (req: RequestWithBody<BodyParams_CreateAndUpdateBlogModel>,res: Response<BlogsType>) => {
    const newBlog = await blogsService.createBlog(req.body.name, req.body.youtubeUrl)
    return res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
})
blogsRoute.get('/:id', checkIdValidForMongodb, async (req: RequestWithParams<URIParams_BlogModel>, res: Response<BlogsType>) => {
    const blog = await blogsQueryRepositories.findBlogById(req.params.id)
    if (!blog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    return res.send(blog)
})
blogsRoute.get('/:blogId/posts', checkBlogIdValidForMongodb, pageValidations, async (req: RequestWithParamsAndQeury<{blogId: string},QeuryParams_GetPostsModel>, //+++
                                                                                     res: Response<TypeForView<PostsType[]>>) => {
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
blogsRoute.post('/:blogId/posts',prePostsValidationByBlogId, async (req: RequestWithParamsAndBody<{blogId:string},BodyParams_FindBlogByIdAndCreatePostModel>, res: Response<PostsType>) => {
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
blogsRoute.put('/:id', checkIdValidForMongodb, blogsValidations, async (req: RequestWithParamsAndBody<URIParams_BlogModel,BodyParams_CreateAndUpdateBlogModel>, res: Response) => {
    const id = req.params.id
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl
    const blog = await blogsService.updateBlogById(id, name, youtubeUrl)
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