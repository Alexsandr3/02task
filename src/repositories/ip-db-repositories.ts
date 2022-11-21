import {ObjectId} from "mongodb";
import {IpClientDBType} from "../types/ip-client_types";
import {IpModelClass} from "./schemas";


export class IpRepositories {
    async createClient(ip: string, url: string, inputDate: Date) {
        const client = new IpClientDBType(new ObjectId(), ip, url, inputDate)
        return await IpModelClass.create(client)
        //return await ipCollection.insertOne(client)
    }

    async getCount(ip: string, url: string, inputDate: Date) {
        return IpModelClass.countDocuments({
            $and: [
                {ip: ip},
                {url: url},
                {inputDate: {$gt: inputDate}}
            ]
        })
     /*   return await ipCollection.countDocuments({
            $and: [
                {ip: ip},
                {url: url},
                {inputDate: {$gt: inputDate}}
            ]
        })*/
    }

}

//export const ipRepositories = new IpRepositories()