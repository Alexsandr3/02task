import {blogsCollection} from "./db";
import {ObjectId} from "mongodb";
import {BlogsDBType, BlogsViewType} from "../types/blogs_types";


const blogWithNewId = (object: BlogsDBType): BlogsViewType => {
    return {
        id: object._id?.toString(),
        name: object.name,
        description: object.description,
        websiteUrl: object.websiteUrl,
        createdAt: object.createdAt
    }
}

export const blogsRepositories = {

    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogsViewType> {
        const newBlog: BlogsDBType = {
            _id: new ObjectId(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString()
        }
        await blogsCollection.insertOne(newBlog)
        return blogWithNewId(newBlog)
    },
    async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })
        return result.matchedCount === 1
    },
    async deleteBlogById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async deleteAll() {
        await blogsCollection.deleteMany({})
    },

}