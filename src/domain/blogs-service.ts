import {blogsRepositories} from "../repositories/blogs-db-repositories";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {BlogsViewType} from "../types/blogs_types";
import {PostsViewType} from "../types/posts_types";




export const blogsService = {
    async createBlog (name: string, description: string, websiteUrl: string): Promise<BlogsViewType>{
        return await blogsRepositories.createBlog(name,description, websiteUrl)
    },
    async updateBlogById (id : string, name:string, description: string, websiteUrl: string): Promise<boolean>{
        return await blogsRepositories.updateBlogById(id, name, description, websiteUrl)
    },
    async createPostsByIdBlog (blogId: string, title:string, shortDescription: string, content: string): Promise<PostsViewType | null>{
        return await postsRepositories.createPost(title, shortDescription, content, blogId)
    },
    async deleteBlogById (id: string): Promise<boolean> {
        return blogsRepositories.deleteBlogById(id)
    }
}