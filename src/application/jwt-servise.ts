import {UsersAcountDBType, UsersViewType} from "../types/users_types";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {TokensType} from "../types/token_types";


export const jwtService = {
    async createJwt(user: UsersAcountDBType) {
        const userId = user._id.toString()
        const accessToken =  jwt.sign({userId: userId}, settings.ACCESS_TOKEN_SECRET, {expiresIn: '20m'})
        const refreshToken =   jwt.sign({userId: userId}, settings.REFRESH_TOKEN_SECRET, {expiresIn: '20m'})
        const returnedTokens: TokensType ={
            accessToken,
            refreshToken
        }
        return returnedTokens
        },
    async createUpdateJwt(id: UsersViewType) {
        const accessToken =  jwt.sign({userId: id}, settings.ACCESS_TOKEN_SECRET, {expiresIn: '20m'})
        const refreshToken =   jwt.sign({userId: id}, settings.REFRESH_TOKEN_SECRET, {expiresIn: '20m'})
        const returnedTokens: TokensType ={
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

