import {blogsCollection, commentsCollection} from "../routes/db";
import {ObjectId} from "mongodb";
import {BlogsDBType, BlogsViewType} from "../types/blogs_types";


const blogWithNewId = (object: BlogsDBType): BlogsViewType => {
    return {
        id: object._id?.toString(),
        name: object.name,
        youtubeUrl: object.youtubeUrl,
        createdAt: object.createdAt
    }
}

export const commentsRepositories = {
    async createBlog (name: string, youtubeUrl: string): Promise<BlogsViewType>{
        const newBlog: BlogsDBType = {
            _id: new ObjectId(),
            name,
            youtubeUrl,
            createdAt: new Date().toISOString()
        }
        await blogsCollection.insertOne(newBlog)
        return blogWithNewId(newBlog)
    },
    async updateCommentsById (id: string, content: string): Promise<boolean>{
        if(!ObjectId.isValid(id)) {
            return false
        }
        const result = await commentsCollection.updateOne({_id:new ObjectId(id)},{$set: {content: content}})
        return result.matchedCount === 1
    },
    async deleteCommentsById (id: string): Promise<boolean> {
        if(!ObjectId.isValid(id)) {
            return false
        }
        const result = await commentsCollection.deleteOne({_id:new ObjectId(id)})
        return result.deletedCount === 1
    },
    async findCommentsById(id: string) {
        return  await commentsCollection.findOne({_id:new ObjectId(id)})
    },
    async deleteAll() {
        await commentsCollection.deleteMany({})
    },

}