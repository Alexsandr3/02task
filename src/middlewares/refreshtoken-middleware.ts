import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {jwtService} from "../application/jwt-servise";
import {deviceRepositories} from "../repositories/device-db-repositories";


export const checkPayloadTokena = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    const payload = await jwtService.verifyToken(refreshToken)


    if (!payload.userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    const userD = await deviceRepositories.findDeviceByUserId(payload.userId, payload.deviceId)
    if (userD) return res.status(HTTP_STATUSES.FORBIDDEN_403).send('Incorrect userId deviceId') //????
   // if (payload.userId !== userD?.userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    req.payload = payload
    console.log('pre -payload"REFRESHtoken.refreshToken-0-0-0-0"', payload)
    next()
}
