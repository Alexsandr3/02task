import {MongoClient, ObjectId} from "mongodb"
import 'dotenv/config'


const mongoUri = process.env.MONGO_URI || "mongodb://0.0.0.0:27017";

export type BlogsType = {
    _id?: ObjectId
    id?: string
    name: string
    youtubeUrl: string
    createdAt: string
}
export  type PostsType = {
    _id?: ObjectId
    id?: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type UsersType = {
    _id?: ObjectId
    id?: string
    login: string
    email: string
    passwordHash?: string,
    createdAt: string
}



export const client = new MongoClient(mongoUri);
const dbName = 'Homework'
const DB = client.db(dbName)

export const blogsCollection = DB.collection<BlogsType>('blogs')
export const postsCollection = DB.collection<PostsType>('posts')
export const usersCollection = DB.collection<UsersType>('users')


export async function runDb() {
    try {
        //connect the client to the server
        await client.connect();
        //Establish and verify connection
        await DB.command({ping:1});
        console.log("Connected successfully to MONGO server");
    } catch {
        console.log("Can't connect to db");
        //Ensures that client will close when you finish/error
        await client.close();
    }
}