import { postsCollection, postsType} from "../routes/db";
import {ObjectId} from "mongodb";
import {blogsRepositories, FindPostsByIdType} from "./blogs-db-repositories";

export const postWithNewId = (object: postsType): postsType => {
    return {
        id: object._id?.toString(),
        title: object.title,
        shortDescription: object.shortDescription,
        content: object.content,
        blogId: object.blogId,
        blogName: object.blogName,
        createdAt: object.createdAt
    }
}

export const postsRepositories ={
    async createPost (title: string, shortDescription: string, content: string, blogId: string): Promise<postsType | null> {
        const blog = await blogsRepositories.findBlogById(blogId)
        if (!blog) {
            return null
        }
        const newPost = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        await postsCollection.insertOne(newPost)

        console.log('newPost ==== repositories', newPost)

        return postWithNewId(newPost)
    },
    async findByIdPost (id: string): Promise<postsType | null> {
        const result = await postsCollection.findOne({_id:new ObjectId(id)})
        if (!result){
            return null
        } else {
            return postWithNewId(result)
        }
    },
    async updatePostById (id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean>{
        const result = await postsCollection.updateOne({_id: new ObjectId(id)},{$set: {title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1
    },
    async deletePostById (id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount !== 0
    },
    async findPosts(data:FindPostsByIdType): Promise<postsType[]> {
        return (await postsCollection
            .find({})
            .skip( ( data.pageNumber - 1 ) * data.pageSize )
            .limit(data.pageSize)
            .sort({ [data.sortBy] : data.sortDirection })
            .toArray()).map(foundPost => postWithNewId(foundPost))
    },
    async deleteAll() {
        await postsCollection.deleteMany({})
    },
    async postsCount (): Promise<number> {
        return postsCollection.countDocuments({})
    }
}