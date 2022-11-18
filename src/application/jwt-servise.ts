import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {TokensType} from "../types/token_types";
import {DeviceDBType} from "../types/device_types";
import {PayloadType} from "../repositories/device-db-repositories";


export const jwtService = {
    async createJwt(userId: string, deviceId: string, lastActiveDate: string) {
        const accessToken = jwt.sign({userId: userId}, settings.ACCESS_TOKEN_SECRET, {expiresIn: '10s'})
        const refreshToken = jwt.sign({
            userId: userId,
            deviceId: deviceId,
            lastActiveDate: lastActiveDate,
        }, settings.REFRESH_TOKEN_SECRET, {expiresIn: '20s'})
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

