import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {jwtService} from "../application/jwt-servise";
import {deviceRepositories} from "../repositories/device-db-repositories";


export const validationInputMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    console.log('000-refreshToken----',refreshToken)
    if (!refreshToken) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    if (!req.params.id) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    const isValidDeviceId = await deviceRepositories.findDeviceByDeviceId(req.params.id)
    console.log('001-isValidDeviceId----',isValidDeviceId)
    if (!isValidDeviceId) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    const payload = await jwtService.verifyToken(refreshToken)
    console.log('002-payload----',payload)
    const dateExp = new Date(payload.exp * 1000)
    console.log('003-dateExp----',dateExp)
    if (dateExp < new Date()) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403) //????
    if (payload.deviceId !== req.params.id) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    const user = await deviceRepositories.findDeviceByUserId(payload.userId)
    console.log('004-user----',user)
    if (payload.userId !== user?.userId) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
  //  req.payload = payload
    next()
}
