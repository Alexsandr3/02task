import {MongoClient,} from "mongodb"
import 'dotenv/config'
import {BlogsType} from "../types/blogs_types";
import {PostsType} from "../types/posts_types";
import {UsersDBType} from "../types/users_types";
import {CommentsType} from "../types/comments_types";

const mongoUri = process.env.MONGO_URI || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(mongoUri);
const dbName = 'Homework'
const DB = client.db(dbName)

export const blogsCollection = DB.collection<BlogsType>('blogs')
export const postsCollection = DB.collection<PostsType>('posts')
export const usersCollection = DB.collection<UsersDBType>('users')
export const commentsCollection = DB.collection<CommentsType>('comments')


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