import {postsRepositories} from "../repositories/posts-db-repositories";
import {PostsViewType} from "../types/posts_types";
import {CommentsViewType} from "../types/comments_types";
import {commentsRepositories} from "../repositories/comments-db-repositories";

class PostsService {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsViewType | null> {
        return  await postsRepositories.createPost(title,shortDescription,content,blogId)
    }
    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return  await postsRepositories.updatePostById(id,title,shortDescription,content,blogId)
    }
    async deletePostById(id: string): Promise<boolean> {
        return await postsRepositories.deletePostById(id)
    }
    async createCommentByIdPost(id: string, content: string, userId: string, userLogin: string): Promise<CommentsViewType | null> {
        const post = await postsRepositories.findPost(id)
        if (!post) return null
        return await commentsRepositories.createCommentByIdPost(post._id, content, userId, userLogin)
    }
}
export const postsService = new PostsService()