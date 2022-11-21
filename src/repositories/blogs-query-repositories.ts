import {blogsCollection, postsCollection} from "./db";
import {ObjectId} from "mongodb";
import {BlogsDBType, BlogsViewType, PaginatorPostsBlogType} from "../types/blogs_types";
import {PaginatorBlogType} from "../types/blogs_types";
import {PostsViewType} from "../types/posts_types";
import {PaginatorType} from "../models/PaginatorType";
import {postWithNewId} from "./posts-query-repositories";



class BlogsQueryRepositories {
    private blogWithNewId(object: BlogsDBType): BlogsViewType {
        return new BlogsViewType(
            object._id?.toString(),
            object.name,
            object.description,
            object.websiteUrl,
            object.createdAt
        )
    }
    async findBlogs(data: PaginatorBlogType): Promise<PaginatorType<BlogsViewType[]>> {
        const foundBlogs = (await blogsCollection
            .find(data.searchNameTerm ? {name: {$regex: data.searchNameTerm, $options: 'i'}} : {})
            .skip((data.pageNumber - 1) * data.pageSize)
            .limit(data.pageSize)
            .sort({[data.sortBy]: data.sortDirection})
            .toArray())
            .map(foundBlog => this.blogWithNewId(foundBlog))
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
    }
    async findBlogById(id: string): Promise<BlogsViewType | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const result = await blogsCollection.findOne({_id: new ObjectId(id)})
        if (!result) {
            return null
        } else {
            return this.blogWithNewId(result)
        }
    }
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
    }
}

export const blogsQueryRepositories = new BlogsQueryRepositories()