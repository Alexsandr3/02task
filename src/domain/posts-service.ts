import {postsType} from "../routes/db";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {FindPostsByIdType} from "../repositories/blogs-db-repositories";
import {blogsTypeServicePost} from "./blogs-service";

export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<postsType | null> {
        return  await postsRepositories.createPost(title,shortDescription,content,blogId)
    },
    async findByIdPost(id: string): Promise<postsType | null> {
        return await postsRepositories.findByIdPost(id)
    },
    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return  await postsRepositories.updatePostById(id,title,shortDescription,content,blogId)
    },
    async deletePostById(id: string): Promise<boolean> {
        return await postsRepositories.deletePostById(id)
    },
    async findPosts(data:FindPostsByIdType): Promise<blogsTypeServicePost> {
        const foundPosts = await postsRepositories.findPosts(data)
        const totalCount = await postsRepositories.postsCount()
        const pagesCountRes = Math.ceil(totalCount/data.pageSize)
        console.log('foundPosts =', foundPosts)
        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: totalCount,
            items: foundPosts
        }
    }
}