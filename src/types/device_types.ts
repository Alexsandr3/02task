import {ObjectId} from "mongodb";


export interface DeviceDBType  {
    _id: ObjectId //  userId
    userId: string
    ip: string  //IP address of device during signing in
    title: string //Device name: for example Chrome 105 (received by parsing http header "user-agent")
    lastActiveDate: string // Date of the last generating of refresh/access tokens
    expiredDate: string
    deviceId: string //  Id of connected device session
}



export  interface DeviceViewModel  {
    ip: string  //IP address of device during signing in
    title: string //Device name: for example Chrome 105 (received by parsing http header "user-agent")
    lastActiveDate: string // Date of the last generating of refresh/access tokens
    deviceId: string //  Id of connected device session
}