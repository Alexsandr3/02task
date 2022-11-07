import { postsCollection} from "../routes/db";
import {ObjectId} from "mongodb";
import {ForFindPostsType, PostsType} from "../types/posts_types";
import {TypeForView} from "../models/TypeForView";



export const postWithNewId = (object: PostsType): PostsType => {
    return {
        id: object._id?.toString(),
        title: object.title,
        shortDescription: object.shortDescription,
        content: object.content,
        blogId: object.blogId,
        blogName: object.blogName,
        createdAt: object.createdAt
    }
}


export const postsQueryRepositories ={
    async findByIdPost (id: string): Promise<PostsType | null> {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const result = await postsCollection.findOne({_id:new ObjectId(id)})
        if (!result){
            return null
        } else {
            return postWithNewId(result)
        }
    },
    async findPosts(data:ForFindPostsType, blogId?: string): Promise<TypeForView<PostsType[]>> {
        const foundPosts = (await postsCollection
            .find({})
            .skip( ( data.pageNumber - 1 ) * data.pageSize )
            .limit(data.pageSize)
            .sort({ [data.sortBy] : data.sortDirection })
            .toArray()).map(foundPost => postWithNewId(foundPost))
        const totalCount = await postsCollection.countDocuments(blogId ? {blogId} : {})
        const pagesCountRes = Math.ceil(totalCount/data.pageSize)
        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: totalCount,
            items: foundPosts
        }
    }
}