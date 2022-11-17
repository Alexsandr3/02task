import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {TokensType} from "../types/token_types";
import {DeviceDBType} from "../types/device_types";


export const jwtService = {
    async createJwt(device: DeviceDBType) {
        const accessToken = jwt.sign({userId: device.userId}, settings.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
        const refreshToken = jwt.sign({
            userId: device.userId,
            deviceId: device.deviceId,
            lastActiveDate: device.lastActiveDate,
        }, settings.REFRESH_TOKEN_SECRET, {expiresIn: '1h'})
        const returnedTokens: TokensType = {
            accessToken,
            refreshToken
        }
        return returnedTokens
    },
    async getUserIdByToken(token: string){
        try {
            const result: any = jwt.verify(token, settings.ACCESS_TOKEN_SECRET)
            return result.userId
        } catch (error) {
            return  null
        }
    },
    async verifyToken(refreshToken: string) {
        try {
            const result: any = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET)
            return result
        } catch (error) {
            return null
        }
    }
    }

