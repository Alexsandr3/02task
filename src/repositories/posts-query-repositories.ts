import {commentsCollection, postsCollection} from "../routes/db";
import {ObjectId} from "mongodb";
import {ForFindPostsType, PostsType} from "../types/posts_types";
import {TypeForView} from "../models/TypeForView";
import {ForFindPostsByBlogIdType} from "../types/blogs_types";
import {CommentsType} from "../types/comments_types";
import {commentWithNewId} from "./comments-query-repositories";




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
    },
    async findCommentsByIdPost(postId: string, data: ForFindPostsByBlogIdType): Promise<TypeForView<CommentsType[]> | null> {
        const post = await postsQueryRepositories.findByIdPost(postId)
        if (!post) return null
        const Commets = (await commentsCollection.find({postId: postId})
            .skip((data.pageNumber - 1) * data.pageSize)
            .limit(data.pageSize)
            .sort({[data.sortBy]: data.sortDirection}).toArray())
            .map(commentWithNewId)
        const totalCountComments = await commentsCollection.countDocuments(postId ? {postId} : {})
        const pagesCountRes = Math.ceil(totalCountComments / data.pageSize)
        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: totalCountComments,
            items: Commets
        }
    }
}