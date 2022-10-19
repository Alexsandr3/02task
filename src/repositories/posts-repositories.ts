import {blogs} from "./blogs-repositories";

export  type postsType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

let posts: postsType[] = []

export const postsRepositories ={
    createPost (title: string, shortDescription: string, content: string, blogId: string){
        const blog = blogs.find(b => b.id === blogId)
        if (!blog) {
            return null
        }
        const newPost = {
            id: (new Date()).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId:blogId,
            blogName: blog.name
        }
        posts.push(newPost)
        return newPost
    },
    searchByIdPost (postId: string){
        const post = posts.find(p => p.id === postId)
        return post
    },
    updatePostById (postId: string, title: string, shortDescription: string, content: string, blogId: string){
        const post = posts.find(p => p.id === postId)
        if (!post) {
            return null
        }
        const blog = blogs.find(b => b.id === blogId)
        if (!blog) {
            return null
        }
       const newPost = {
            id: postId,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId:blogId,
            blogName: blog.name
        }
        posts.filter(p => p.id !== postId)
        posts.push(newPost)
        return post;
    },
    deletePostById (postId: string){
        const postForDelete = posts.find(p => p.id === postId)
        if (!postForDelete) {
            return false;
        }
        posts = posts.filter(p => p.id !== postId)
        return true
    }
}