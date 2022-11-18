import {deviceCollection} from "../routes/db";
import {ObjectId} from "mongodb";
import {DeviceDBType} from "../types/device_types";



export type PayloadType = {
    userId: string
    deviceId: string
    iat: number
    exp: number
}




export const deviceRepositories = {
    async createDevice(userId: string, ipAddress: string, deviceName: string, deviceId: string, exp: number, iat: number):Promise<DeviceDBType> {
        const dateCreatedToken = (new Date(iat * 1000)).toISOString();
        const dateExpiredToken = (new Date(exp * 1000)).toISOString();
        const newDevice: DeviceDBType = {
            _id: new ObjectId(),
            userId: userId,
            ip: ipAddress,
            title: deviceName,
            lastActiveDate: dateCreatedToken,
            expiredDate: dateExpiredToken,
            deviceId: deviceId
        }
        await deviceCollection.insertOne(newDevice)
        return newDevice
    },
    async findDevice(payload: PayloadType): Promise<DeviceDBType | null> {
        const dateCreatedToken = (new Date(payload.iat*1000)).toISOString();
        const result = await deviceCollection
            .findOne({
                $and: [
                    {userId: {$eq: payload.userId}},
                    {deviceId: {$eq: payload.deviceId}},
                    {lastActiveDate: {$eq: dateCreatedToken}} //?!
                ]
            })
        if (!result) {
            return null
        } else {
            return result
        }
    },
    async findDeviceForValid(userId: string, deviceId: string, iat: number): Promise<DeviceDBType | null> {
        const dateCreateToken = (new Date(iat * 1000)).toISOString();
        const result = await deviceCollection
            .findOne({
                $and: [
                    {userId: userId},
                    {deviceId: deviceId},
                    {lastActiveDate: dateCreateToken},
                ]
            })
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
    async updateDateDevice(payload: PayloadType, oldIat: number): Promise<boolean> {
        const dateCreatedOldToken = (new Date(oldIat * 1000)).toISOString();
        const dateCreateToken = (new Date(payload.iat * 1000)).toISOString();
        const dateExpiredToken = (new Date(payload.exp * 1000)).toISOString();
        const result = await deviceCollection.updateOne({
            $and: [
                {userId: {$eq: payload.userId}},
                {deviceId: {$eq: payload.deviceId}},
                {lastActiveDate: {$eq: dateCreatedOldToken}},
            ]
        }, {
            $set: {
                lastActiveDate: dateCreateToken,
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