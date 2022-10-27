import {MongoClient, ObjectId} from "mongodb"
//import 'dotnev/config'


const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";

export type blogsType = {
    _id?: ObjectId
    id?: string,
    name: string,
    youtubeUrl: string,
    createdAt: string
}
export  type postsType = {
    _id?: ObjectId
    id?: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}


export const client = new MongoClient(mongoUri);
const dbName = 'Homework'
const DB = client.db(dbName)

export const blogsCollection = DB.collection<blogsType>('blogs')
export const postsCollection = DB.collection<postsType>('posts')


export async function runDb() {
    try {
        //connect the client to the server
        await client.connect();
        //Establish and verify connection
        await DB.command({ping:1});
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Can't connect to db");
        //Ensures that client will close when you finish/error
        await client.close();
    }
}