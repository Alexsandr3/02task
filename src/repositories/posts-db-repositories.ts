import {blogsCollection, postsCollection} from "../routes/db";

export  type postsType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

let posts: postsType[] = []

export const postsRepositories ={
    async createPost (title: string, shortDescription: string, content: string, blogId: string): Promise<postsType | null> {
        const blog = await blogsCollection.findOne({id:blogId})
        if (!blog) {
            return null
        }
        const newPost = {
            id: (+new Date()).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId:blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        await postsCollection.insertOne({...newPost})
        return newPost
    },
    async findByIdPost (id: string): Promise<postsType | null> {
        return await postsCollection.findOne({id},{projection: {_id: false}})
    },
    async updatePostById (postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean>{
        const post = await postsCollection.updateOne({id:postId},{$set: {title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return post.matchedCount === 1
    },
    async deletePostById (id: string): Promise<postsType | null> {
        const post = await postsCollection.deleteOne({id})
        if (!post) {
            return null
        }
        return await postsCollection.findOne({id})

    },
    async findPosts(): Promise<postsType[]> {
        return postsCollection.find({}, {projection: {_id: false}}).toArray()
    }
}