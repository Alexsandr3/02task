import {blogsCollection, blogsType} from "../routes/db";
import {ObjectId} from "mongodb";

const blogWithNewId = (object: blogsType): blogsType => {
    return {
        id: object._id?.toString(),
        name: object.name,
        youtubeUrl: object.youtubeUrl,
        createdAt: object.createdAt
    }
}

export const blogsRepositories = {
    async findBlogs(): Promise<blogsType[]>  {
        return (await blogsCollection.find({}).toArray()).map( foundBlog => blogWithNewId(foundBlog))
    },
    async createBlog (name: string, youtubeUrl: string): Promise<blogsType>{
        const newBlog: blogsType = {
            _id: new ObjectId(),
            name,
            youtubeUrl,
            createdAt: new Date().toISOString()
        }
        await blogsCollection.insertOne(newBlog)
        return blogWithNewId(newBlog)
    },
    async findBlogById (id: string): Promise<blogsType | null> {
        const result = await blogsCollection.findOne({_id:new ObjectId(id)})
        if (!result){
            return null
        } else {
            return blogWithNewId(result)
        }
    },
    async updateBlogById (id: string, name:string, youtubeUrl: string): Promise<boolean>{
        const result = await blogsCollection.updateOne({_id:new ObjectId(id)},{$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    },
    async deleteBlogById (id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id:new ObjectId(id)})
        return result.deletedCount === 1
    },
    async deleteAll() {
        await blogsCollection.deleteMany({})
    }
}