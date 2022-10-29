import {
    blogsRepositories,
    FindBlogsType,
    FindPostsByIdType
} from "../repositories/blogs-db-repositories";
import {blogsType, postsType} from "../routes/db";
import {postsRepositories} from "../repositories/posts-db-repositories";


export type blogsTypeService = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: blogsType[]
}
export type blogsTypeServicePost = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: postsType[] | []
}



export const blogsService = {
    async findBlogs(data: FindBlogsType): Promise<blogsTypeService>  {
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
    async createBlog (name: string, youtubeUrl: string): Promise<blogsType>{
        return await blogsRepositories.createBlog(name,youtubeUrl)
    },
    async findBlogById (id: string): Promise<blogsType | null> {
        return blogsRepositories.findBlogById(id)
    },
    async findPostsByIdBlog (blogId: string, data: FindPostsByIdType): Promise<blogsTypeServicePost | null> {
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
    async createPostsByIdBlog (blogId: string, title:string, shortDescription: string, content: string): Promise<postsType | null>{
        return await postsRepositories.createPost(title, shortDescription, content, blogId)
    },
    async deleteBlogById (id: string): Promise<boolean> {
        return blogsRepositories.deleteBlogById(id)
    }
}