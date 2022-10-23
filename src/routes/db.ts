import {MongoClient} from "mongodb"
import {blogsType} from "../repositories/blogs-db-repositories";
import {postsType} from "../repositories/posts-db-repositories";
const mongoUri =
    process.env.mongoURI || "mongodb+srv://back07-project07:7424fernis@dbback07.1a5at0j.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(mongoUri);
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