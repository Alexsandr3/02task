import {
    blogsRepositories,
    FindBlogsType,
    FindPostsByIdType
} from "../repositories/blogs-db-repositories";
import {BlogsType, PostsType} from "../routes/db";
import {postsRepositories} from "../repositories/posts-db-repositories";


export type BlogsTypeForService = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogsType[]
}
export type BlogsTypeForServicePost = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostsType[] | []
}


export const blogsService = {
    async findBlogs(data: FindBlogsType): Promise<BlogsTypeForService>  {
        const foundBlogs = await blogsRepositories.findBlogs(data)
        const totalCount = await blogsRepositories.blogsCount(data)
        const pagesCountRes = Math.ceil(totalCount/data.pageSize)
        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: totalCount,
            items: foundBlogs
        }
    },
    async createBlog (name: string, youtubeUrl: string): Promise<BlogsType>{
        return await blogsRepositories.createBlog(name,youtubeUrl)
    },
    async findBlogById (id: string): Promise<BlogsType | null> {
        return blogsRepositories.findBlogById(id)
    },
    async findPostsByIdBlog (blogId: string, data: FindPostsByIdType): Promise<BlogsTypeForServicePost | null> {
        const blog = await blogsRepositories.findBlogById(blogId)
        if (!blog) return null
        const postsByIdBlog = await blogsRepositories.findPostsByIdBlog(blogId, data)
        const totalCount = await postsRepositories.postsCount(blogId)
        const pagesCountRes = Math.ceil(totalCount/data.pageSize)

        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: totalCount,
            items: postsByIdBlog ? postsByIdBlog : []
        }
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