import {postsRepositories} from "../repositories/posts-db-repositories";
import {PostsType} from "../types/posts_types";
import {CommentsType} from "../types/comments_types";


export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsType | null> {
        return  await postsRepositories.createPost(title,shortDescription,content,blogId)
    },
    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return  await postsRepositories.updatePostById(id,title,shortDescription,content,blogId)
    },
    async deletePostById(id: string): Promise<boolean> {
        return await postsRepositories.deletePostById(id)
    },
    async createCommentByIdPost(id: string, content: string, userId: string, userLogin: string): Promise<CommentsType | null>{
        return await postsRepositories.createCommentByIdPost(id,content, userId, userLogin)
    }
}