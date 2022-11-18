import {deviceCollection} from "../routes/db";
import {ObjectId} from "mongodb";
import {UsersAcountDBType} from "../types/users_types";
import {DeviceDBType} from "../types/device_types";
import {randomUUID} from "crypto";



export type PayloadType = {
    userId: string//"6376111dfe0c28e48bc83560",
    deviceId: string//"ef83c60c-347d-408c-80c0-bc430186b525",
    lastActiveDate: string
    iat: string//1668682349,
    exp: string//1668685949
}


export const deviceRepositories = {
    async createDevice(user: UsersAcountDBType, ipAddress: string, deviceName: string, dateOfLogin: string) {
        const newDevice: DeviceDBType = {
            _id: new ObjectId(),
            userId: user._id.toString(),
            ip: ipAddress,
            title: deviceName,
            lastActiveDate: new Date().toISOString(),
            expiredDate: dateOfLogin,
            deviceId: randomUUID()
        }
        await deviceCollection.insertOne(newDevice)
        return newDevice
    },
    async findDevice(payload: PayloadType): Promise<DeviceDBType | null> {
        const result = await deviceCollection
            .findOne({
                $and: [
                    {userId: {$eq: payload.userId}},
                    {deviceId: {$eq: payload.deviceId}}
                    //{lastActiveDate: {$eq: payload.lastActiveDate}}
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
        const dateCreatedToken = (new Date(payload.iat)).toISOString();
        const dateExpiredToken = (new Date(payload.exp)).toISOString();
        const result = await deviceCollection.updateOne({
            $and: [
                {userId: {$eq: payload.userId}},
                {deviceId: {$eq: payload.deviceId}},
            ]
        }, {
            $set: {
                lastActiveDate: dateCreatedToken,
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