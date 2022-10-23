import {blogsCollection} from "../routes/db";


export type blogsType = {
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
}

export let blogs: blogsType[] = []
export const blogsRepositories = {
    async findBlogs(): Promise<blogsType[]>  {
        return blogsCollection.find({}, {projection: {_id: false}}).toArray()
    },
    async createBlog (name: string, youtubeUrl: string): Promise<blogsType>{
        const newBlog = {
            id: (+new Date()).toString(),
            name: name,
            youtubeUrl: youtubeUrl,
            createdAt: new Date().toISOString()
        }
        await blogsCollection.insertOne({...newBlog})
        return newBlog
    },
    async findBlogById (id: string): Promise<blogsType | null> {
        return await blogsCollection.findOne({id},{projection: {_id: false}})
    },
    async updateBlogById (id: string, name:string, youtubeUrl: string): Promise<boolean>{
        const result = await blogsCollection.updateOne({id:id},{$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    },
    async deleteBlogById (id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id:id})
        return result.deletedCount === 1
    }
}