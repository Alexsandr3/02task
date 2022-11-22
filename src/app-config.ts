import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import {authRoute} from "./routes/auth-router";
import {blogsRouter} from "./routes/blogs-router";
import {commentsRoute} from "./routes/comments-router";
import {postsRoute} from "./routes/post-router";
import {usersRoute} from "./routes/users-router";
import {HTTP_STATUSES} from "./const/HTTP response status codes";
import cookieParser from "cookie-parser";
import cors from "cors";
import {securityRoute} from "./routes/security-router";
import {
    BlogModelClass,
    CommentModelClass,
    DeviceModelClass,
    IpModelClass,
    LikeModelClass, PostModelClass, UserModelClass
} from "./repositories/schemas";


export const app = express()

const jsonBodyMiddleware = bodyParser.json()


app.use(cors())
app.use(jsonBodyMiddleware)
app.use(cookieParser())
app.set('trust proxy', true)


app.use('/auth', authRoute)
app.use('/blogs', blogsRouter)
app.use('/comments', commentsRoute)
app.use('/posts', postsRoute)
app.use('/users', usersRoute)
app.use('/security', securityRoute)




app.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OK_200).json({
        message: "Don't panic, eat draniks"
    })
})
app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await BlogModelClass.deleteMany({})
    await CommentModelClass.deleteMany({})
    await DeviceModelClass.deleteMany({})
    await IpModelClass.deleteMany({})
    await LikeModelClass.deleteMany({})
    await PostModelClass.deleteMany({})
    await UserModelClass.deleteMany({})
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})