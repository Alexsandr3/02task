import {deviceRepositories, PayloadType} from "../repositories/device-db-repositories";


class DeviceService {
    async deleteByDeviceId(deviceIdForDelete: string, deviceId: string, userId: string): Promise<boolean | null> {
        const isUserDevice = await deviceRepositories.findByDeviceIdAndUserId(userId, deviceId)
        if (!isUserDevice) return null
        const deviceForDelete = await deviceRepositories.findByDeviceIdAndUserId(userId, deviceIdForDelete)
        if (!deviceForDelete) return null
        const isDelete = await deviceRepositories.deleteDeviceByDeviceId(deviceIdForDelete)
        if (!isDelete) return null
        return true
    }

    async deleteDevices(payload: PayloadType) {
        return await deviceRepositories.deleteDevices(payload)
    }
}
export const deviceService = new DeviceService()