import {ObjectId} from "mongodb";
import {IpClientDBType} from "../types/ip-client_types";
import {ipCollection} from "./db";



export const ipRepositories = {
    async createClient(ip: string, url: string, inputDate: Date) {
        const client: IpClientDBType = {
            _id: new ObjectId(),
            ip,
            url: url,
            inputDate
        }
        return await ipCollection.insertOne(client)
    },
    async getCount(ip: string, url: string, inputDate:Date){
        return await ipCollection.countDocuments({
            $and: [
                {ip: ip},
                {url: url},
                {inputDate: {$gt: inputDate}}
            ]
        })
    },
    async deleteAll() {
        await ipCollection.deleteMany({})
    }
}