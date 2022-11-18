import {deviceCollection} from "../routes/db";
import {ObjectId} from "mongodb";
import {DeviceDBType} from "../types/device_types";



export type PayloadType = {
    userId: string//"6376111dfe0c28e48bc83560",
    deviceId: string//"ef83c60c-347d-408c-80c0-bc430186b525",
    lastActiveDate: string
    iat: number
    exp: number
}


export const deviceRepositories = {
    async createDevice(userId: string, ipAddress: string, deviceName: string, deviceId: string, exp: number, iat: number) {
        const dateCreatedToken = (new Date(iat*1000)).toISOString();
        const dateExpiredToken = (new Date(exp*1000)).toISOString();
        const newDevice: DeviceDBType = {
            _id: new ObjectId(),
            userId: userId,
            ip: ipAddress,
            title: deviceName,
            lastActiveDate: dateCreatedToken,
            expiredDate: dateExpiredToken,
            deviceId: deviceId
        }
        console.log('newDevice||||_____', newDevice)
        await deviceCollection.insertOne(newDevice)
        return newDevice
    },
    async findDevice(payload: PayloadType): Promise<DeviceDBType | null> {
        const result = await deviceCollection
            .findOne({
                $and: [
                    {userId: {$eq: payload.userId}},
                    {deviceId: {$eq: payload.deviceId}},
                    {lastActiveDate: {$eq: payload.lastActiveDate}} //?!
                ]
            })
        if (!result) {
            return null
        } else {
            return result
        }
    },
    async findDeviceByUserId(userId: string): Promise<DeviceDBType | null> {
        const result = await deviceCollection
            .findOne({userId: userId})
        if (!result) {
            return null
        } else {
            return result
        }
    },
    async findDeviceByDeviceId(deviceId: string): Promise<DeviceDBType | null> {
        const result = await deviceCollection
            .findOne({deviceId: deviceId})
        if (!result) {
            return null
        } else {
            return result
        }
    },
    async updateDevice(payload: PayloadType): Promise<boolean> {
        const dateCreatedToken = (new Date(payload.iat*1000)).toISOString();
        const dateExpiredToken = (new Date(payload.exp*1000)).toISOString();
        const result = await deviceCollection.updateOne({
            $and: [
                {userId: {$eq: payload.userId}},
                {deviceId: {$eq: payload.deviceId}},
                {lastActiveDate: {$eq: dateCreatedToken}},
            ]
        }, {
            $set: {
                lastActiveDate: dateCreatedToken,
                expiredDate: dateExpiredToken
            }
        })
        return result.modifiedCount === 1
    },
    async updateExpDateDevice(payload: PayloadType){
       // const dateCreatedToken = (new Date(payload.iat)).toISOString();
        const exp = payload.exp*1000
        const dateExpiredToken = (new Date(exp)).toISOString();
        const result = await deviceCollection.updateOne({
            $and: [
                {userId: {$eq: payload.userId}},
                {deviceId: {$eq: payload.deviceId}},
            ]
        }, {
            $set: {
                expiredDate: dateExpiredToken
            }
        })
        return result.modifiedCount === 1
    },
    async deleteDevice(payload: PayloadType): Promise<boolean> {
        const result = await deviceCollection.deleteOne({
            $and: [
                {userId: {$eq: payload.userId}},
                {deviceId: {$eq: payload.deviceId}},
            ]
        })
        return result.deletedCount === 1
    },
    async deleteDevices(payload: PayloadType) {
        return  await deviceCollection.deleteMany({userId: payload.userId, deviceId: {$ne: payload.deviceId}})
    },
    async deleteDeviceByDeviceId(deviceId: string) {
        return  await deviceCollection.deleteMany({deviceId: deviceId})
    },
    async deleteAll() {
        await deviceCollection.deleteMany({})
    }
}