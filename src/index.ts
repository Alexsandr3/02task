import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import {blogsRoute} from "./routes/blogs-router"
import {postsRoute} from "./routes/post-router"
import {usersRoute} from "./routes/users-router";
import {runDb} from "./routes/db";
import {blogsRepositories} from "./repositories/blogs-db-repositories";
import {postsRepositories} from "./repositories/posts-db-repositories";
import {authRoute} from "./routes/auth-router";


const app = express()
const port = process.env.PORT || 5002
const jsonBodyMiddleware = bodyParser.json()


app.use(jsonBodyMiddleware)


app.use('/', authRoute)
app.use('/blogs', blogsRoute)
app.use('/posts', postsRoute)
app.use('/users', usersRoute)




app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Hi need "
    })
})
app.delete('/testing/all-data', (req: Request, res: Response) => {
    blogsRepositories.deleteAll();
    postsRepositories.deleteAll();
    res.sendStatus(204)
})

const startApp = async () => {
    await runDb()
    app.listen(port,  () => {
        console.log(`Example app listening on port: ${port}`)
    })
}
startApp()
