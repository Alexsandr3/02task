import { Response, Router} from "express";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {prePostsValidation} from "../middlewares/posts-validation-middleware";
import {SortDirectionType} from "../types/blogs_types";
import {postsService} from "../domain/posts-service";
import {pageValidations} from "../middlewares/blogs-validation-middleware";
import {checkIdValidForMongodb} from "../middlewares/check-valid-id-from-db";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQeury} from "../Req_types";
import {QeuryParams_GetPostsModel} from "../models/QeuryParams_GetPostsModel";
import {BodyParams_CreateAndUpdatePostModel} from "../models/BodyParams_CreateAndUpdatePostModel";
import {PostsType} from "../types/posts_types";
import {URIParams_PostModel} from "../models/URIParams_PostModel";
import {postsQueryRepositories} from "../repositories/posts-query-repositories";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {TypeForView} from "../models/TypeForView";


export const postsRoute = Router({})


postsRoute.get('/', pageValidations, async (req: RequestWithQeury<QeuryParams_GetPostsModel>, res: Response<TypeForView<PostsType[]>>) => {
    let data = req.query
    let dataForRepos = {
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: SortDirectionType.Desc,
        ...data,
    }
    const posts = await postsQueryRepositories.findPosts(dataForRepos);
    res.send(posts)
})
postsRoute.post('/', prePostsValidation, async (req: RequestWithBody<BodyParams_CreateAndUpdatePostModel>, res: Response<PostsType | null>) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const newPost = await postsService.createPost(title, shortDescription, content, blogId)
    return res.status(HTTP_STATUSES.CREATED_201).send(newPost)
})
postsRoute.get('/:id', checkIdValidForMongodb, async (req: RequestWithParams<URIParams_PostModel>, res: Response<PostsType>) => {
    const post = await postsQueryRepositories.findByIdPost(req.params.id)
    if (!post) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return res.send(post)
})
postsRoute.put('/:id', checkIdValidForMongodb, prePostsValidation, async (req: RequestWithParamsAndBody<URIParams_PostModel, BodyParams_CreateAndUpdatePostModel>, res: Response) => {
    const postId = req.params.id
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const isPostUpdated = await postsService.updatePostById(postId, title, shortDescription, content, blogId)
    if (!isPostUpdated) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
postsRoute.delete('/:id', checkIdValidForMongodb, checkAutoritionMiddleware, async (req: RequestWithParams<URIParams_PostModel>, res: Response) => {
    const isDelete = await postsService.deletePostById(req.params.id)
    if (!isDelete) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
})