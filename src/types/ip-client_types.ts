import {ObjectId} from "mongodb";



export class IpClientDBType {
    constructor(public _id: ObjectId,
                public ip: string,
                public url: string,
                public inputDate: Date) {
    }
}
