import {blogsCollection, blogsType, postsCollection, postsType} from "../routes/db";
import {ObjectId} from "mongodb";
import {postWithNewId} from "./posts-db-repositories";

const blogWithNewId = (object: blogsType): blogsType => {
    return {
        id: object._id?.toString(),
        name: object.name,
        youtubeUrl: object.youtubeUrl,
        createdAt: object.createdAt
    }
}

export type SortDirectionType = 'asc' | 'desc'
export type FindBlogsType = {
    searchNameTerm: string | null,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirectionType
}
export type FindPostsByIdType = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirectionType
}

export const blogsRepositories = {
    async findBlogs(data: FindBlogsType): Promise<blogsType[]>  {
        return (await blogsCollection
            .find( data.searchNameTerm ? {name: { $regex: data.searchNameTerm, $options: 'i' }} : {})
            .skip( ( data.pageNumber - 1 ) * data.pageSize )
            .limit(data.pageSize)
            .sort({ [data.sortBy] : data.sortDirection })
            .toArray())
            .map( foundBlog => blogWithNewId(foundBlog))
    },
    async createBlog (name: string, youtubeUrl: string): Promise<blogsType>{
        const newBlog: blogsType = {
            _id: new ObjectId(),
            name,
            youtubeUrl,
            createdAt: new Date().toISOString()
        }
        await blogsCollection.insertOne(newBlog)
        return blogWithNewId(newBlog)
    },
    async findBlogById (id: string): Promise<blogsType | null> {
        const result = await blogsCollection.findOne({_id:new ObjectId(id)})
        if (!result){
            return null
        } else {
            return blogWithNewId(result)
        }
    },
    async findPostsByIdBlog (blogId: string, data: FindPostsByIdType): Promise<Array<postsType> | null> {
        const result = (await postsCollection
            .find({blogId})
            .skip( ( data.pageNumber - 1 ) * data.pageSize )
            .limit(data.pageSize)
            .sort({ [data.sortBy] : data.sortDirection }).toArray())
            .map(postWithNewId)

        if (!result){
            return null
        } else {
            return result
        }
    },
    async updateBlogById (id: string, name:string, youtubeUrl: string): Promise<boolean>{
        const result = await blogsCollection.updateOne({_id:new ObjectId(id)},{$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    },
    async createPostsByIdBlog (blogId: string, title:string, shortDescription: string, content: string): Promise<postsType | null>{
        const result = await postsCollection.findOne({blogId})
        if (!result) {
            return null
        }
        const newPost = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: result.blogName,
            createdAt: new Date().toISOString()
        }
        await postsCollection.insertOne(newPost)
        return postWithNewId(newPost)

    },
    async deleteBlogById (id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id:new ObjectId(id)})
        return result.deletedCount === 1
    },
    async deleteAll() {
        await blogsCollection.deleteMany({})
    },

    async blogsCount (data: FindBlogsType): Promise<number> {
        const filter = data.searchNameTerm ? {name: { $regex: data.searchNameTerm, $options: 'i' }} : {}
        return blogsCollection.countDocuments(filter)
    }
}