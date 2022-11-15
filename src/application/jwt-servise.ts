import {UsersAcountDBType} from "../types/users_types";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";


export const jwtService = {
    async createJwt(user: UsersAcountDBType) {

        const accessToken =  jwt.sign({userId: user._id}, settings.ACCESS_TOKEN_SECRET, {expiresIn: '10s'})
        const refreshToken =   jwt.sign({userId: user._id}, settings.REFRESH_TOKEN_SECRET, {expiresIn: '20s'})
        const returnedTokens ={
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
            return result.userId
        } catch (error) {
            return null
        }
    }
    }

