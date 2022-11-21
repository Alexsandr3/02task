import {BlogsRepositories} from "../repositories/blogs-db-repositories";
import {BlogsViewType} from "../types/blogs_types";
import {PostsViewType} from "../types/posts_types";
import {PostsRepositories} from "../repositories/posts-db-repositories";


export class BlogsService {
    constructor(protected blogsRepositories: BlogsRepositories, protected postsRepositories: PostsRepositories) {}

    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogsViewType> {
        return await this.blogsRepositories.createBlog(name, description, websiteUrl)
    }

    async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await this.blogsRepositories.updateBlogById(id, name, description, websiteUrl)
    }

    async createPostsByIdBlog(blogId: string, title: string, shortDescription: string, content: string): Promise<PostsViewType | null> {
        return await this.postsRepositories.createPost(title, shortDescription, content, blogId)
    }

    async deleteBlogById(id: string): Promise<boolean> {
        return this.blogsRepositories.deleteBlogById(id)
    }
}
