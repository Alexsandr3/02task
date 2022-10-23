import {blogs} from "./blogs-repositories";

export  type postsType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

let posts: postsType[] = []

export const postsRepositories ={
    createPost (title: string, shortDescription: string, content: string, blogId: string){
        const blog = blogs.find(b => b.id === blogId)
        if (!blog) {
            return null
        }
        const newPost = {
            id: (+new Date()).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId:blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        posts.push(newPost)
        return newPost
    },
    searchByIdPost (postId: string){
        return posts.find(p => p.id === postId)
    },
    updatePostById (postId: string, title: string, shortDescription: string, content: string, blogId: string){
        const post = posts.find(p => p.id === postId)
        if (!post) {
            return null
        }
        post.title = title
        post.shortDescription = shortDescription
        post.content = content
        post.blogId = blogId
        return post

    },
    deletePostById (postId: string){
        const postForDelete = posts.find(p => p.id === postId)
        if (!postForDelete) {
            return false;
        }
        posts = posts.filter(p => p.id !== postId)
        return true
    },
    findPosts() {
       return  posts
    }
}