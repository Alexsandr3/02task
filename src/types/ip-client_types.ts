import {ObjectId} from "mongodb";


export interface IpClientDBType  {
    _id: ObjectId
    ip: string
    url: string
    inputDate: Date
}

