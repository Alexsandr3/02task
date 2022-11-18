import {UsersAcountDBType, UsersViewType} from "../types/users_types";
import bcrypt from 'bcrypt'
import {usersRepositories} from "../repositories/users-db-repositories";
import {jwtService} from "../application/jwt-servise";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {ObjectId} from "mongodb";
import {emailManagers} from "../managers/email-managers";
import {deviceRepositories, PayloadType} from "../repositories/device-db-repositories";


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
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmation: false,
                sentEmails: [{
                    sentDate: new Date()
                }]
            }
        }
        const newUser = await usersRepositories.createUser(user)
        try {
            await emailManagers.sendEmailConfirmation(newUser.email, user.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)
            await usersRepositories.deleteUser(user)
            return null
        }
        return newUser
    },
    async deleteUserById(id: string): Promise<boolean> {
        return usersRepositories.deleteUserById(id)
    },
    async login(loginOrEmail: string, password: string, ipAddress: string, deviceName: string) {
        const user: any = await usersRepositories.findByLoginOrEmail(loginOrEmail)
        if (!user) return null;
        const result = await this._compareHash(password, user.accountData.passwordHash)
        if (!result) return null;
        const dateOfLogin = new Date().toISOString()
        const device = await deviceRepositories.createDevice(user, ipAddress, deviceName, dateOfLogin)
        const token = await jwtService.createJwt(device.userId, device.deviceId, device.lastActiveDate)
        const payloadNew = await jwtService.verifyToken(token.refreshToken)
        await deviceRepositories.updateExpDateDevice(payloadNew)
        console.log('0101010 - payloadNew.exp---', payloadNew.exp)
        console.log('0101010 - tokenREFRESH ---', token.refreshToken)
        return token
    },
    async verifyToken(payload: PayloadType) {
        const device = await deviceRepositories.findDevice(payload)
        if (!device) return null
       // const newTokens = await jwtService.createJwt(payload.userId, payload.deviceId, payload.lastActiveDate)
        const newTokens = await jwtService.createJwt(device.userId, device.deviceId, device.lastActiveDate)
        const payloadNew = await jwtService.verifyToken(newTokens.refreshToken)
        const updateDevice = await deviceRepositories.updateDevice(payloadNew)
        if (!updateDevice) return null
        return newTokens
    },
    async verifyTokenForDeleteDevice(payload: PayloadType) {
        const device = await deviceRepositories.findDevice(payload)
        if (!device) return null
        const isDeleted = await deviceRepositories.deleteDevice(payload)
        if (!isDeleted) return null
        return true
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
        } catch (error) {
            console.error(error)
            return null
        }
        return newUser
    }
}