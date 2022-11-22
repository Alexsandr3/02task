import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {TokensType} from "../types/token_types";

class JwtService {
    async createJwt(userId: string, deviceId: string) {
        const accessToken = jwt.sign({userId: userId}, settings.ACCESS_TOKEN_SECRET, {expiresIn: '7m'})
        const refreshToken = jwt.sign({
            userId: userId,
            deviceId: deviceId,
        }, settings.REFRESH_TOKEN_SECRET, {expiresIn: '24h'})
        return new TokensType(accessToken, refreshToken)
    }

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.ACCESS_TOKEN_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }

    async verifyToken(refreshToken: string) {
        try {
            const result: any = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET)
            return result
        } catch (error) {
            return null
        }
    }
}

export const jwtService = new JwtService()

