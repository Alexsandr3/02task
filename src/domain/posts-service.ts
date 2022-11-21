import {PostsRepositories} from "../repositories/posts-db-repositories";
import {PostsViewType} from "../types/posts_types";
import {CommentsViewType} from "../types/comments_types";
import {CommentsRepositories} from "../repositories/comments-db-repositories";

export class PostsService {

    constructor(protected postsRepositories: PostsRepositories, protected commentsRepositories: CommentsRepositories) {}

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsViewType | null> {
        return await this.postsRepositories.createPost(title, shortDescription, content, blogId)
    }

    async updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await this.postsRepositories.updatePostById(id, title, shortDescription, content, blogId)
    }

    async deletePostById(id: string): Promise<boolean> {
        return await this.postsRepositories.deletePostById(id)
    }

    async createCommentByIdPost(id: string, content: string, userId: string, userLogin: string): Promise<CommentsViewType | null> {
        const post = await this.postsRepositories.findPost(id)
        if (!post) return null
        return await this.commentsRepositories.createCommentByIdPost(post._id, content, userId, userLogin)
    }
}

