import {ObjectId} from "mongodb";
import {ForFindPostsType, PostsDBType, PostsViewType} from "../types/posts_types";
import {PaginatorType} from "../models/PaginatorType";
import {PaginatorPostsBlogType} from "../types/blogs_types";
import {CommentsDBType, CommentsViewType} from "../types/comments_types";
import {CommentModelClass, PostModelClass} from "./schemas";




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

export class PostsQueryRepositories {
    private commentWithNewId(object: CommentsDBType): CommentsViewType {
        return new CommentsViewType(
            object._id?.toString(),
            object.content,
            object.userId,
            object.userLogin,
            object.createdAt)
    }
    async findByIdPost (id: string): Promise<PostsViewType | null> {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const result = await PostModelClass.findOne({_id:new ObjectId(id)})
        if (!result){
            return null
        } else {
            return postWithNewId(result)
        }
    }
    async findPosts(data:ForFindPostsType, blogId?: string): Promise<PaginatorType<PostsViewType[]>> {
        const foundPosts = (await PostModelClass
            .find({})
            .skip( ( data.pageNumber - 1 ) * data.pageSize )
            .limit(data.pageSize)
            .sort({ [data.sortBy] : data.sortDirection })
            .lean()).map(foundPost => postWithNewId(foundPost))
        const totalCount = await PostModelClass.countDocuments(blogId ? {blogId} : {})
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
        const post = await this.findByIdPost(postId)
        if (!post) return null
        const Commets = (await CommentModelClass.find({postId: postId})
            .skip((data.pageNumber - 1) * data.pageSize)
            .limit(data.pageSize)
            .sort({[data.sortBy]: data.sortDirection}).lean())
            .map(this.commentWithNewId)
        const totalCountComments = await PostModelClass.countDocuments(postId ? {postId} : {})
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
//export const postsQueryRepositories = new PostsQueryRepositories()