import {commentsCollection, postsCollection} from "../routes/db";
import {ObjectId} from "mongodb";
import {blogsQueryRepositories} from "./blogs-query-repositories";
import {PostsType} from "../types/posts_types";
import {CommentsType} from "../types/comments_types";
import {commentWithNewId} from "./comments-query-repositories";




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
    async createPost (title: string, shortDescription: string, content: string, blogId: string): Promise<PostsType | null> {
        const blog = await blogsQueryRepositories.findBlogById(blogId)
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
        return postWithNewId(newPost)
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
    async deleteAll() {
        await postsCollection.deleteMany({})
    },
    async createCommentByIdPost (id: string, content: string, userId: string, userLogin: string): Promise<CommentsType | null> {
        const post = await postsCollection.findOne({_id:new ObjectId(id)})
        if (!post) {
            return null
        }
        const newComment = {
            _id: new ObjectId(),
            postId: post._id.toString(),
            content: content,
            userId: userId,
            userLogin: userLogin,
            createdAt: new Date().toISOString()
        }
        await commentsCollection.insertOne(newComment)
        return commentWithNewId(newComment)
    }
}