import {blogsCollection, postsCollection} from "./db";
import {ObjectId} from "mongodb";
import {postWithNewId} from "./posts-db-repositories";
import {BlogsDBType, BlogsViewType, PaginatorPostsBlogType} from "../types/blogs_types";
import {paginatorBlogType} from "../types/blogs_types";
import {PostsViewType} from "../types/posts_types";
import {PaginatorType} from "../models/PaginatorType";


const blogWithNewId = (object: BlogsDBType): BlogsViewType => {
    return {
        id: object._id?.toString(),
        name: object.name,
        description: object.description,
        websiteUrl: object.websiteUrl,
        createdAt: object.createdAt
    }
}


export const blogsQueryRepositories = {
    async findBlogs(data: paginatorBlogType): Promise<PaginatorType<BlogsViewType[]>> {
        const foundBlogs = (await blogsCollection
            .find(data.searchNameTerm ? {name: {$regex: data.searchNameTerm, $options: 'i'}} : {})
            .skip((data.pageNumber - 1) * data.pageSize)
            .limit(data.pageSize)
            .sort({[data.sortBy]: data.sortDirection})
            .toArray())
            .map(foundBlog => blogWithNewId(foundBlog))
        const totalCount = await blogsCollection.countDocuments(data.searchNameTerm ? {
            name: {
                $regex: data.searchNameTerm,
                $options: 'i'
            }
        } : {})
        const pagesCountRes = Math.ceil(totalCount / data.pageSize)
        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: totalCount,
            items: foundBlogs
        }
    },
    async findBlogById(id: string): Promise<BlogsViewType | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const result = await blogsCollection.findOne({_id: new ObjectId(id)})
        if (!result) {
            return null
        } else {
            return blogWithNewId(result)
        }
    },
    async findPostsByIdBlog(blogId: string, data: PaginatorPostsBlogType): Promise<PaginatorType<PostsViewType[]> | null> {
        const blog = await blogsQueryRepositories.findBlogById(blogId)
        if (!blog) return null
        const foundPosts = (await postsCollection
            .find({blogId})
            .skip((data.pageNumber - 1) * data.pageSize)
            .limit(data.pageSize)
            .sort({[data.sortBy]: data.sortDirection}).toArray())
            .map(postWithNewId)
        const totalCountPosts = await postsCollection.countDocuments(blogId ? {blogId} : {})
        const pagesCountRes = Math.ceil(totalCountPosts / data.pageSize)
        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: totalCountPosts,
            items: foundPosts
        }

    },
}