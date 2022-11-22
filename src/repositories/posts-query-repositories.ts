import {ObjectId} from "mongodb";
import {ForFindPostsType, PostsDBType, PostsViewType} from "../types/posts_types";
import {PaginatorType} from "../types/PaginatorType";
import {PaginatorPostsBlogType} from "../types/blogs_types";
import {CommentsDBType, CommentsViewType, LikesInfoViewModel} from "../types/comments_types";
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
    private async commentWithNewId(object: CommentsDBType): Promise<CommentsViewType | null> {
        const totalCountLike = await LikeModelClass.countDocuments({_id: object._id, likeStatus: "like"})
        const totalCountDislike = await LikeModelClass.countDocuments({commentId: object._id, likeStatus: "dislike"})
        const findComment = await LikeModelClass.findOne({userId: object.userId})
        if (!findComment) return null
        const likesInfo = new LikesInfoViewModel(
            totalCountLike,
            totalCountDislike,
            findComment.likeStatus)
        return new CommentsViewType(
            object._id?.toString(),
            object.content,
            object.userId,
            object.userLogin,
            object.createdAt,
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

    async findCommentsByIdPost(postId: string, data: PaginatorPostsBlogType) {
        const post = await this.findByIdPost(postId)
        if (!post) return null
        const comments = await CommentModelClass.find({postId: postId})
            .skip((data.pageNumber - 1) * data.pageSize)
            .limit(data.pageSize)
            .sort({[data.sortBy]: data.sortDirection}).lean()
        const mappedComments = comments.map(await this.commentWithNewId)
        const itemsComments = await Promise.all(mappedComments)
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