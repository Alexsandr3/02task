export type blogsType = {
    id: string
    name: string
    youtubeUrl: string
}

export let blogs: blogsType[] = []
export const blogsRepositories = {
    createBlog (name: string, youtubeUrl: string){
        const newBlog = {
            id:(new Date()).toString(),
            name: name,
            youtubeUrl: youtubeUrl
        }
        blogs.push(newBlog)
        return newBlog
    },
    searchBlogById (id: string){
        return blogs.find(v => v.id === id)
    },
    updateBlogById (id: string, name:string, youtubeUrl: string){
        const blog = blogs.find(v => v.id === id)
        if (!blog){
            return null
        }
        blog.name = name
        blog.youtubeUrl = youtubeUrl
        return blog;
    },
    deleteBlogById (id: string){
        const newBlogs = blogs.find(v => v.id === id)
        if (!newBlogs) {
            return false;
        }
        blogs = blogs.filter(b => b.id !== id)
        return true
    }
}