import {ObjectId} from "mongodb";

export class DeviceDBType {
    constructor(public _id: ObjectId,
                public userId: string,
                public ip: string,
                public title: string,
                public lastActiveDate: string,
                public expiredDate: string,
                public deviceId: string) {
    }
}

/*export class DeviceViewModel {
    constructor(public ip: string,
                public title: string,
                public lastActiveDate: string,
                public deviceId: string) {
    }
}*/


export  interface DeviceViewModel  {
    ip: string  //IP address of device during signing in
    title: string //Device name: for example Chrome 105 (received by parsing http header "user-agent")
    lastActiveDate: string // Date of the last generating of refresh/access tokens
    deviceId: string //  Id of connected device session
}