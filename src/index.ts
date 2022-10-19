import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import {blogsRoute} from "./routes/blogs-router"
import {postsRoute} from "./routes/post-router"

const app = express()
const port = process.env.PORT || 5002
const jsonBodyMiddleware = bodyParser.json()

app.use(jsonBodyMiddleware)
app.use('/blogs', blogsRoute)
app.use('/posts', postsRoute)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Hi need "
    })
})

/*app.delete('/testing/all-data', (req: Request, res: Response) => {
    blogs = []
    res.send(204)*/

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})