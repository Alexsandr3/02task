import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'


type blogsType = {
    id: number
    name: string
    youtubeUrl: string
}

const app = express()
const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

const port = process.env.PORT || 3001

let blogs: blogsType[] = []

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})
app.get('/blogs', (req: Request, res: Response) => {
    res.send(blogs)
})
app.post('/blogs', (req: Request, res: Response) => {
    let error: {errorsMessages: any[]} = {
        errorsMessages: []
    }
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl
    if (!name || typeof name !== 'string' || !name.trim() || name.length > 15){
        error.errorsMessages.push({
            "message": "Incorrect name",
            "field": "name"
        })
    }
    if (youtubeUrl.length > 100) {
        error.errorsMessages.push({
            "message": "Incorrect youtubeUrl",
            "field": "youtubeUrl"
        })
    }
    if (error.errorsMessages.length){
        res.status(400).send(error)
        return;
    }
    const newBlog = {
        id: +new Date().getTime(),
        name,
        youtubeUrl
    }
    blogs.push(newBlog)
    res.status(201).send(newBlog)


    res.send(blogs)
})
app.get('/blogs/:blogId', (req: Request, res: Response) => {
    const blog = blogs.find(v => v.id === +req.params.blogId)
    if (!blogs){
        res.sendStatus(404)
        return;
    }
    res.send(blog)
})
app.put('/blogs/:blogId', (req: Request, res: Response) => {
    let error: {errorsMessages: any[]} = {
        errorsMessages: []
    }
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl
    if (!name || typeof name !== 'string' || !name.trim() || name.length > 15){
        error.errorsMessages.push({
            "message": "Incorrect name",
            "field": "name"
        })
    }
    if (youtubeUrl.length > 100) {
        error.errorsMessages.push({
            "message": "Incorrect youtubeUrl",
            "field": "youtubeUrl"
        })
    }
    if (error.errorsMessages.length){
        res.status(400).send(error)
        return;
    }
    const blog = blogs.find(v => v.id === +(req.params.blogId))
    if (!blog){
        res.sendStatus(404)
        return;
    }
    blog.name = req.body.name;
    blog.youtubeUrl = req.body.youtubeUrl;

    res.sendStatus(204)
})
app.delete('/blogs/:blogId', (req: Request, res: Response) => {
    const id = +req.params.blogId;
    const newVideos = blogs.find(v => v.id === id)
    if (!newVideos){
        res.sendStatus(404)
        return;
    }
    blogs = blogs.filter( v => v.id !== id)
    res.send(204)
})





app.delete('/testing/all-data', (req: Request, res: Response) => {
    blogs = []
    res.send(204)
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})