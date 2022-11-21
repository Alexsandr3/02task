import {DeviceRepositories, PayloadType} from "../repositories/device-db-repositories";


export class DeviceService {

    constructor(protected deviceRepositories: DeviceRepositories) {}

    async deleteByDeviceId(deviceIdForDelete: string, deviceId: string, userId: string): Promise<boolean | null> {
        const isUserDevice = await this.deviceRepositories.findByDeviceIdAndUserId(userId, deviceId)
        if (!isUserDevice) return null
        const deviceForDelete = await this.deviceRepositories.findByDeviceIdAndUserId(userId, deviceIdForDelete)
        if (!deviceForDelete) return null
        const isDelete = await this.deviceRepositories.deleteDeviceByDeviceId(deviceIdForDelete)
        if (!isDelete) return null
        return true
    }

    async deleteDevices(payload: PayloadType) {
        return await this.deviceRepositories.deleteDevices(payload)
    }
}
