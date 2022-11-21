import {postsCollection} from "./db";
import {ObjectId} from "mongodb";
import {blogsQueryRepositories} from "./blogs-query-repositories";
import {PostsDBType, PostsViewType} from "../types/posts_types";


class PostsRepositories {
    private postWithNewId(object: PostsDBType): PostsViewType {
        return new PostsViewType(
            object._id?.toString(),
            object.title,
            object.shortDescription,
            object.content,
            object.blogId,
            object.blogName,
            object.createdAt
        )
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsViewType | null> {
        const blog = await blogsQueryRepositories.findBlogById(blogId)
        if (!blog) {
            return null
        }
        const newPost = new PostsDBType(
            new ObjectId(),
            title,
            shortDescription,
            content,
            blogId,
            blog.name,
            new Date().toISOString())
        await postsCollection.insertOne(newPost)
        return this.postWithNewId(newPost)
    }

    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await postsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId
            }
        })
        return result.matchedCount === 1
    }

    async deletePostById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount !== 0
    }

    async findPost(id: string): Promise<PostsDBType | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})
        if (!post) return null
        return post
    }
}

export const postsRepositories = new PostsRepositories()