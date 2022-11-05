import {blogsCollection} from "../routes/db";
import {ObjectId} from "mongodb";
import {BlogsType} from "../types/blogs_types";


const blogWithNewId = (object: BlogsType): BlogsType => {
    return {
        id: object._id?.toString(),
        name: object.name,
        youtubeUrl: object.youtubeUrl,
        createdAt: object.createdAt
    }
}

export const blogsRepositories = {
    async createBlog (name: string, youtubeUrl: string): Promise<BlogsType>{
        const newBlog: BlogsType = {
            _id: new ObjectId(),
            name,
            youtubeUrl,
            createdAt: new Date().toISOString()
        }
        await blogsCollection.insertOne(newBlog)
        return blogWithNewId(newBlog)
    },
    async updateBlogById (id: string, name:string, youtubeUrl: string): Promise<boolean>{
        if(!ObjectId.isValid(id)) {
            return false
        }
        const result = await blogsCollection.updateOne({_id:new ObjectId(id)},{$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    },
    async deleteBlogById (id: string): Promise<boolean> {
        if(!ObjectId.isValid(id)) {
            return false
        }
        const result = await blogsCollection.deleteOne({_id:new ObjectId(id)})
        return result.deletedCount === 1
    },
    async deleteAll() {
        await blogsCollection.deleteMany({})
    },

}