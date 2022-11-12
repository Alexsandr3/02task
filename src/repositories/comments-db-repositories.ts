import {commentsCollection} from "../routes/db";
import {ObjectId} from "mongodb";




export const commentsRepositories = {
    async updateCommentsById (id: string, content: string): Promise<boolean>{
        if(!ObjectId.isValid(id)) {
            return false
        }
        const result = await commentsCollection.updateOne({_id:new ObjectId(id)},{$set: {content: content}})
        return result.matchedCount === 1
    },
    async deleteCommentsById (id: string): Promise<boolean> {
        if(!ObjectId.isValid(id)) {
            return false
        }
        const result = await commentsCollection.deleteOne({_id:new ObjectId(id)})
        return result.deletedCount === 1
    },
    async findCommentsById(id: string) {
        return  await commentsCollection.findOne({_id:new ObjectId(id)})
    },
    async deleteAll() {
        await commentsCollection.deleteMany({})
    },

}