import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import {authRoute} from "./routes/auth-router";
import {blogsRoute} from "./routes/blogs-router";
import {commentsRoute} from "./routes/comments-router";
import {postsRoute} from "./routes/post-router";
import {usersRoute} from "./routes/users-router";
import {HTTP_STATUSES} from "./const/HTTP response status codes";
import {blogsRepositories} from "./repositories/blogs-db-repositories";
import {postsRepositories} from "./repositories/posts-db-repositories";
import {usersRepositories} from "./repositories/users-db-repositories";
import {commentsRepositories} from "./repositories/comments-db-repositories";
import {emailRoute} from "./routes/email-router";

export const app = express()

const jsonBodyMiddleware = bodyParser.json()


app.use(jsonBodyMiddleware)


app.use('/auth', authRoute)
app.use('/blogs', blogsRoute)
app.use('/comments', commentsRoute)
app.use('/posts', postsRoute)
app.use('/users', usersRoute)
app.use('/email', emailRoute)




app.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OK_200).json({
        message: "Hi need "
    })
})
app.delete('/testing/all-data', (req: Request, res: Response) => {
    blogsRepositories.deleteAll();
    postsRepositories.deleteAll();
    usersRepositories.deleteAll();
    commentsRepositories.deleteAll();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})