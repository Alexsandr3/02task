import {blogsRepositories} from "../repositories/blogs-db-repositories";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {BlogsType} from "../types/blogs_types";
import {PostsType} from "../types/posts_types";




export const blogsService = {

    async createBlog (name: string, youtubeUrl: string): Promise<BlogsType>{
        return await blogsRepositories.createBlog(name,youtubeUrl)
    },
    async updateBlogById (id : string, name:string, youtubeUrl: string): Promise<boolean>{
        return await blogsRepositories.updateBlogById(id, name, youtubeUrl)
    },
    async createPostsByIdBlog (blogId: string, title:string, shortDescription: string, content: string): Promise<PostsType | null>{
        return await postsRepositories.createPost(title, shortDescription, content, blogId)
    },
    async deleteBlogById (id: string): Promise<boolean> {
        return blogsRepositories.deleteBlogById(id)
    }
}