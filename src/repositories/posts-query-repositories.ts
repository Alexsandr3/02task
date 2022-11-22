import {ObjectId} from "mongodb";
import {ForFindPostsType, PostsDBType, PostsViewType} from "../types/posts_types";
import {PaginatorType} from "../types/PaginatorType";
import {PaginatorPostsBlogType} from "../types/blogs_types";
import {CommentsDBType, CommentsViewType, LikesInfoViewModel, LikeStatusType} from "../types/comments_types";
import {CommentModelClass, LikeModelClass, PostModelClass} from "./schemas";


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
    private async commentWithNewId(comment: CommentsDBType, userId: string | null): Promise<CommentsViewType | null> {
        let myStatus: string = LikeStatusType.None
        if (userId) {
            const res = await LikeModelClass.findOne({userId: userId, parentId: comment._id})
            if (res){
                myStatus = res.likeStatus
            }
        }
        const totalCountLike = await LikeModelClass.countDocuments({parentId: comment._id, likeStatus: "Like"})
        const totalCountDislike = await LikeModelClass.countDocuments({parentId: comment._id, likeStatus: "Dislike"})
        const likesInfo = new LikesInfoViewModel(
            totalCountLike,
            totalCountDislike,
            myStatus)
        return new CommentsViewType(
            comment._id?.toString(),
            comment.content,
            comment.userId,
            comment.userLogin,
            comment.createdAt,
            likesInfo)
    }

    async findByIdPost(id: string): Promise<PostsViewType | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const result = await PostModelClass.findOne({_id: new ObjectId(id)})
        if (!result) {
            return null
        } else {
            return postWithNewId(result)
        }
    }

    async findPosts(data: ForFindPostsType, blogId?: string): Promise<PaginatorType<PostsViewType[]>> {
        const foundPosts = (await PostModelClass
            .find({})
            .skip((data.pageNumber - 1) * data.pageSize)
            .limit(data.pageSize)
            .sort({[data.sortBy]: data.sortDirection})
            .lean()).map(foundPost => postWithNewId(foundPost))
        const totalCount = await PostModelClass.countDocuments(blogId ? {blogId} : {})
        const pagesCountRes = Math.ceil(totalCount / data.pageSize)
        return {
            pagesCount: pagesCountRes,
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: totalCount,
            items: foundPosts
        }
    }

    async findCommentsByIdPost(postId: string, data: PaginatorPostsBlogType, userId: string | null) {
        const post = await this.findByIdPost(postId)
        if (!post) return null
        const comments = await CommentModelClass.find({postId: postId})
            .skip((data.pageNumber - 1) * data.pageSize)
            .limit(data.pageSize)
            .sort({[data.sortBy]: data.sortDirection}).lean()
        const mappedComments = comments.map(async comment => await this.commentWithNewId(comment, userId))
        const itemsComments = await Promise.all(mappedComments)
        console.log(mappedComments)
        console.log(itemsComments)
        if (!comments) return null
        const totalCountComments = await PostModelClass.countDocuments(postId ? {postId} : {})
        const pagesCountRes = Math.ceil(totalCountComments / data.pageSize)
        return new PaginatorType(
            pagesCountRes,
            data.pageNumber,
            data.pageSize,
            totalCountComments,
            itemsComments
        )
    }
}