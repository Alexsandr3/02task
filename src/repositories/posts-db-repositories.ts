import { postsCollection, PostsType} from "../routes/db";
import {ObjectId} from "mongodb";
import {blogsRepositories, FindPostsByIdType} from "./blogs-db-repositories";

export const postWithNewId = (object: PostsType): PostsType => {
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
    async createPost (title: string, shortDescription: string, content: string, id: string): Promise<PostsType | null> {
        const blog = await blogsRepositories.findBlogById(id)
        if (!blog) {
            return null
        }
        const newPost = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: id,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        await postsCollection.insertOne(newPost)
        return postWithNewId(newPost)
    },
    async findByIdPost (id: string): Promise<PostsType | null> {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const result = await postsCollection.findOne({_id:new ObjectId(id)})
        if (!result){
            return null
        } else {
            return postWithNewId(result)
        }
    },
    async updatePostById (id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean>{
        if(!ObjectId.isValid(id)) {
            return false
        }
        const result = await postsCollection.updateOne({_id: new ObjectId(id)},{$set: {title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1
    },
    async deletePostById (id: string): Promise<boolean> {
        if(!ObjectId.isValid(id)) {
            return false
        }
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount !== 0
    },
    async findPosts(data:FindPostsByIdType): Promise<PostsType[]> {
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
    async postsCount (blogId?: string): Promise<number> {
        return postsCollection.countDocuments(blogId ? {blogId} : {})
    }
}