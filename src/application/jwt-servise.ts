import {UsersAcountDBType} from "../types/users_types";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";


export const jwtService = {
    async createJwt(user: UsersAcountDBType) {
        return  jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '2h'})
        },
    async getUserIdByToken(token: string){
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return  null
        }
    }
    }

