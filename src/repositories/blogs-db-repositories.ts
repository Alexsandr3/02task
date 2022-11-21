import {BlogModelClass} from "./schemas";
import {ObjectId} from "mongodb";
import {BlogsDBType, BlogsViewType} from "../types/blogs_types";


export class BlogsRepositories {
    private blogWithNewId(object: BlogsDBType): BlogsViewType {
        return new BlogsViewType(
            object._id?.toString(),
            object.name,
            object.description,
            object.websiteUrl,
            object.createdAt
        )
    }

    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogsViewType> {
        const newBlog = new BlogsDBType(
            new ObjectId(),
            name,
            description,
            websiteUrl,
            new Date().toISOString()
        )
        await BlogModelClass.create(newBlog)
        return this.blogWithNewId(newBlog)
    }

    async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await BlogModelClass.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })
        return result.matchedCount === 1
    }

    async deleteBlogById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await BlogModelClass.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}

