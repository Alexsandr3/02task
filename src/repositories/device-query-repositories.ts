import {DeviceDBType, DeviceViewModel} from "../types/device_types";
import {DeviceModelClass} from "./schemas";


const deviceForView = (object: DeviceDBType): DeviceViewModel => {
    return {
        ip: object.ip,
        title: object.title,
        lastActiveDate: object.lastActiveDate,
        deviceId: object.deviceId
    }
}

class DeviceQueryRepositories {
    async findDevices(userId: string): Promise<DeviceViewModel[] | null> {
        const result = (await DeviceModelClass
            .find({userId: userId}).lean()).map(foundDevice => deviceForView(foundDevice))
        if (!result) {
            return null
        } else {
            return result
        }
    }
}
export const deviceQueryRepositories = new DeviceQueryRepositories()