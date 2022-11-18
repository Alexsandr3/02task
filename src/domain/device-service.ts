import {deviceRepositories} from "../repositories/device-db-repositories";



export const deviceService = {
    async deleteByIdDevice(deviceIdForDelete: string, deviceId: string, userId: string) {
        const isUserDevice = await deviceRepositories.findByIdDeviceAndUserId(userId, deviceId)
        if (!isUserDevice) return null
        const deviceForDelete = await deviceRepositories.findByIdDeviceAndUserId(userId, deviceIdForDelete)
        if (!deviceForDelete) return null
        const isDelete = await deviceRepositories.deleteDeviceByDeviceId(deviceIdForDelete)
        if (!isDelete) return null
        return true
    }
}