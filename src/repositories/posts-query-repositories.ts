import {commentsCollection, postsCollection} from "./db";
import {ObjectId} from "mongodb";
import {ForFindPostsType, PostsDBType, PostsViewType} from "../types/posts_types";
import {PaginatorType} from "../models/PaginatorType";
import {PaginatorPostsBlogType} from "../types/blogs_types";
import {CommentsViewType} from "../types/comments_types";
import {commentWithNewId} from "./comments-query-repositories";




export const postWithNewId = (object: PostsDBType): PostsViewType => {
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

class PostsQueryRepositories {
    async findByIdPost (id: string): Promise<PostsViewType | null> {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const result = await postsCollection.findOne({_id:new ObjectId(id)})
        if (!result){
            return null
        } else {
            return postWithNewId(result)
        }
    }
    async findPosts(data:ForFindPostsType, blogId?: string): Promise<PaginatorType<PostsViewType[]>> {
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
    async findCommentsByIdPost(postId: string, data: PaginatorPostsBlogType): Promise<PaginatorType<CommentsViewType[]> | null> {
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
export const postsQueryRepositories = new PostsQueryRepositories()