import {DeviceModelClass} from "./schemas";
import {ObjectId} from "mongodb";
import {DeviceDBType} from "../types/device_types";

export class PayloadType {
    constructor(public userId: string,
                public deviceId: string,
                public iat: number,
                public exp: number) {
    }
}


export class DeviceRepositories {
    async createDevice(userId: string, ipAddress: string, deviceName: string, deviceId: string, exp: number, iat: number): Promise<DeviceDBType> {
        const dateCreatedToken = (new Date(iat * 1000)).toISOString();
        const dateExpiredToken = (new Date(exp * 1000)).toISOString();
        const newDevice = new DeviceDBType(
            new ObjectId(),
            userId,
            ipAddress,
            deviceName,
            dateCreatedToken,
            dateExpiredToken,
            deviceId)
        await DeviceModelClass.create(newDevice)
        return newDevice
    }

    async findDeviceForDelete(payload: PayloadType): Promise<DeviceDBType | null> {
        const dateCreatedToken = (new Date(payload.iat * 1000)).toISOString();
        const result = await DeviceModelClass
            .findOne({
                $and: [
                    {userId: {$eq: payload.userId}},
                    {deviceId: {$eq: payload.deviceId}},
                    {lastActiveDate: {$eq: dateCreatedToken}}
                ]
            })
        if (!result) {
            return null
        } else {
            return result
        }
    }

    async findDeviceForValid(userId: string, deviceId: string, iat: number): Promise<DeviceDBType | null> {
        const dateCreateToken = (new Date(iat * 1000)).toISOString();
        const result = await DeviceModelClass
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
    }

    async findDeviceByDeviceId(deviceId: string): Promise<DeviceDBType | null> {
        const result = await DeviceModelClass
            .findOne({deviceId: deviceId})
        if (!result) {
            return null
        } else {
            return result
        }
    }

    async updateDateDevice(payload: PayloadType, oldIat: number): Promise<boolean> {
        const dateCreatedOldToken = (new Date(oldIat * 1000)).toISOString();
        const dateCreateToken = (new Date(payload.iat * 1000)).toISOString();
        const dateExpiredToken = (new Date(payload.exp * 1000)).toISOString();
        const result = await DeviceModelClass.updateOne({
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
    }

    async deleteDevice(payload: PayloadType): Promise<boolean> {
        const result = await DeviceModelClass.deleteOne({
            $and: [
                {userId: {$eq: payload.userId}},
                {deviceId: {$eq: payload.deviceId}},
            ]
        })
        return result.deletedCount === 1
    }

    async findByDeviceIdAndUserId(userId: string, deviceId: string) {
        return DeviceModelClass.findOne({userId, deviceId},)
    }

    async deleteDevices(payload: PayloadType) {
        return DeviceModelClass.deleteMany({userId: payload.userId, deviceId: {$ne: payload.deviceId}})
    }

    async deleteDeviceByDeviceId(deviceId: string) {
        return DeviceModelClass.deleteMany({deviceId: deviceId})
    }

    /* async test (fromDeviceId: string, deleteDeviceId: string, userId: string) {
         const result = await deviceCollection.find({userId, deviceId: {$or: [{fromDeviceId},{ deleteDeviceId}]}}).toArray()
         return result.length === 2
     }*/
}
