import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {jwtService} from "../application/jwt-servise";
import {deviceRepositories} from "../repositories/device-db-repositories";


export const checkAccess = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    console.log('0004---refreshToken-----', refreshToken)
    const payload = await jwtService.verifyToken(refreshToken)
    const deviceUser = await deviceRepositories.findDeviceForValid(payload.userId, payload.deviceId, payload.iat)
    console.log('0005---deviceUser-----', deviceUser)
    console.log('0006---req.params.id-----', req.params.id)
    if(!deviceUser) return res.status(HTTP_STATUSES.UNAUTHORIZED_401).send('Incorrect userId or deviceId or issuedAt')
    if(deviceUser.deviceId !== req.params.id) return res.status(HTTP_STATUSES.FORBIDDEN_403).send('Incorrect deviceIdt')
    req.payload = payload
    next()
}
