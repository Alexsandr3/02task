import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {jwtService} from "../application/jwt-servise";
import {deviceRepositories} from "../repositories/device-db-repositories";


export const checkPayloadTokena = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    console.log('00-refreshToken----',refreshToken)
    if (!refreshToken) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    const payload = await jwtService.verifyToken(refreshToken)
    console.log('01-payload----',payload)
    if (!payload.userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    const user = await deviceRepositories.findDeviceByUserId(payload.userId)
    console.log('02-user----',user)
    if (payload.userId !== user?.userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    req.payload = payload
    next()
}
