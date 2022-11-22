import {Response, Router} from "express";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {prePostsValidation} from "../middlewares/posts-validation-middleware";
import {SortDirectionType} from "../types/blogs_types";
import {pageValidations} from "../middlewares/blogs-validation-middleware";
import {
    checkIdValidForMongodb,
    checkPostIdValidForMongodb
} from "../middlewares/check-valid-id-from-db";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQeury,
    RequestWithQeury
} from "../types/Req_types";
import {QeuryParams_GetPostsModel} from "../models/QeuryParams_GetPostsModel";
import {BodyParams_PostInputModel} from "../models/BodyParams_PostInputModel";
import {PostsViewType} from "../types/posts_types";
import {URIParams_PostModel} from "../models/URIParams_PostModel";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {PaginatorType} from "../types/PaginatorType";
import {preCommentsValidation} from "../middlewares/comments-validation-middleware";
import {authMiddleware} from "../middlewares/auth-Headers-Validations-Middleware";
import {pageNumberValidation, pageSizeValidation} from "../middlewares/users-validation-middleware";
import {BodyParams_CommentInputModel} from "../models/BodyParams_CommentInputModel";
import {postsQueryRepositories, postsService} from "../composition-root";
import {CommentsViewType} from "../types/comments_types";


export const postsRoute = Router({})


postsRoute.get('/', pageValidations, async (req: RequestWithQeury<QeuryParams_GetPostsModel>, res: Response<PaginatorType<PostsViewType[]>>) => {
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
postsRoute.post('/', prePostsValidation, async (req: RequestWithBody<BodyParams_PostInputModel>, res: Response<PostsViewType | null>) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const newPost = await postsService.createPost(title, shortDescription, content, blogId)
    return res.status(HTTP_STATUSES.CREATED_201).send(newPost)
})
postsRoute.get('/:id', checkIdValidForMongodb, async (req: RequestWithParams<URIParams_PostModel>, res: Response<PostsViewType>) => {
    const post = await postsQueryRepositories.findByIdPost(req.params.id)
    if (!post) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return res.send(post)
})
postsRoute.put('/:id', checkIdValidForMongodb, prePostsValidation, async (req: RequestWithParamsAndBody<URIParams_PostModel, BodyParams_PostInputModel>, res: Response) => {
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
postsRoute.post('/:postId/comments', authMiddleware, checkPostIdValidForMongodb, preCommentsValidation, async (req: RequestWithParamsAndBody<{postId: string}, BodyParams_CommentInputModel>, res: Response<CommentsViewType | null>) => {
    const postId = req.params.postId
    const content = req.body.content
    if (!req.user) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    const userId = req.user.id
    const userLogin = req.user.login

    const createdCommetn = await postsService.createCommentByIdPost(postId, content, userId, userLogin)
    if (!createdCommetn) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    return res.status(HTTP_STATUSES.CREATED_201).send(createdCommetn)
})

postsRoute.get('/:postId/comments', checkPostIdValidForMongodb, pageNumberValidation, pageSizeValidation, async (req: RequestWithParamsAndQeury<{ postId: string }, QeuryParams_GetPostsModel>,
                                                                                                                 res: Response) => {

    let data = req.query
    let postId = req.params.postId
    let dataForReposit = {
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: SortDirectionType.Desc,
        ...data,
    }
    const comments = await postsQueryRepositories.findCommentsByIdPost(postId, dataForReposit)
    if (!comments) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }
    return res.send(comments)
})
