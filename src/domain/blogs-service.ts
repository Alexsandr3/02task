import {
    blogsRepositories,
    FindBlogsType,
    FindPostsByIdType
} from "../repositories/blogs-db-repositories";
import {blogsType, postsType} from "../routes/db";


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
    items: postsType[]
}



export const blogsService = {
    async findBlogs(data: FindBlogsType): Promise<blogsTypeService>  {
        const foundBlogs = await blogsRepositories.findBlogs(data)
        const pagesCountRes = Math.ceil(foundBlogs.length/data.pageSize)
        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: foundBlogs.length,
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
        const postsByIdBlog = await blogsRepositories.findPostsByIdBlog(blogId, data)
        if (!postsByIdBlog){
            return null
        }
        const pagesCountRes = Math.ceil(postsByIdBlog.length/data.pageSize)
        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: postsByIdBlog.length,
            items: postsByIdBlog
        }
    },
    async updateBlogById (id : string, name:string, youtubeUrl: string): Promise<boolean>{
        return await blogsRepositories.updateBlogById(id, name, youtubeUrl)
    },
    async createPostsByIdBlog (blogId: string, title:string, shortDescription: string, content: string): Promise<postsType | null>{
        return await blogsRepositories.createPostsByIdBlog(blogId,title,shortDescription,content)
    },
    async deleteBlogById (id: string): Promise<boolean> {
        return blogsRepositories.deleteBlogById(id)
    }
}