import {UsersAcountDBType, UsersViewType} from "../types/users_types";
import bcrypt from 'bcrypt'
import {usersRepositories} from "../repositories/users-db-repositories";
import {jwtService} from "../application/jwt-servise";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {ObjectId} from "mongodb";
import {emailManagers} from "../managers/email-managers";
import {usersQueryRepositories} from "../repositories/users-query-repositories";


export const usersService = {
    async createUser(login: string, email: string, password: string): Promise<UsersViewType | null> {
        const passwordHash = await this._generateHash(password)
        const user: UsersAcountDBType = {
            _id: new ObjectId(),
            accountData: {
                login,
                email,
                passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(),{
                    hours: 1
                }),
                isConfirmation: false,
                sentEmails: [{
                    sentDate: new Date()
                }]
            }
        }
        console.log('001 - user|', user)
        const newUser = await usersRepositories.createUser(user)
        console.log('002 - newUser|', newUser)
        try {
            await emailManagers.sendEmailConfirmation(newUser.email, user.emailConfirmation.confirmationCode)
        } catch (error){
            console.error(error)
            await usersRepositories.deleteUser(user)
            return null
        }
        return newUser
    },
    async deleteUserById(id: string): Promise<boolean> {
        return usersRepositories.deleteUserById(id)
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user: any = await usersRepositories.findByLoginOrEmail(loginOrEmail)
        if (!user) return null;
      //  if(!user.emailConfirmation.isConfirmation) return null;
        const result = await this._compareHash(password, user.accountData.passwordHash)
        if (!result) return null;
        return   await jwtService.createJwt(user)
    },
    async verifyToken(refreshToken: string) {
        const result = await jwtService.verifyToken(refreshToken)
        if(result){
            const verifiedToken = await usersQueryRepositories.verifyToken(refreshToken)
            if (!verifiedToken) {
                const newTokens = await jwtService.createJwt(result)
                await usersRepositories.saveExpiredRefreshToken(refreshToken)
                return newTokens
            }
            return false
        }
        return false
    },
    async verifyTokenForAddBlackList(refreshToken: string) {
        const result = await jwtService.verifyToken(refreshToken)
        if (result) {
            const expiredToken = await usersRepositories.saveExpiredRefreshToken(refreshToken)
            if (expiredToken) {
                return true
            }
            return false
        }
        return false
    },
    async _generateHash(password: string) {
        return await bcrypt.hash(password, 10)
    },
    async _compareHash(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    },
    async confirmByCode(code: string): Promise<boolean> {
        const user = await usersRepositories.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmation) return false;
        if (user.emailConfirmation.confirmationCode !== code) return false;
        if (user.emailConfirmation.expirationDate < new Date()) return false;
        return await usersRepositories.updateConfirmation(user._id)
    },
    async resendingEmail(email: string) {
        const user = await usersRepositories.findByLoginOrEmail(email)
        if (!user) return false;
        if (user.emailConfirmation.isConfirmation) return false;
        if (user.emailConfirmation.expirationDate < new Date()) return false;
        const code: any = {
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1
                })
            }
        }
        const newUser = await usersRepositories.updateCodeConfirmation(user._id, code.emailConfirmation.confirmationCode, code.emailConfirmation.expirationDate)
        try {
            await emailManagers.sendEmailRecoveryMessage(user.accountData.email, code.emailConfirmation.confirmationCode)
        } catch (error){
            console.error(error)
            return null
        }
        return newUser
    }
}