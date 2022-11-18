import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {jwtService} from "../application/jwt-servise";
import {deviceRepositories} from "../repositories/device-db-repositories";


export const validationInputMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    if (!req.params.id) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    const isValidDeviceId = await deviceRepositories.findDeviceByDeviceId(req.params.id)
    console.log('001-isValidDeviceId----',isValidDeviceId)
    if (!isValidDeviceId) return res.status(HTTP_STATUSES.NOT_FOUND_404).send("Incorrect device by URL_param")
    const payload = await jwtService.verifyToken(refreshToken)
    console.log('002-payload----',payload)
    const dateExp = new Date(payload.exp * 1000)
    console.log('003-dateExp----',dateExp)
    console.log('004-newDate----',new Date())
    if (payload.deviceId !== req.params.id) return res.status(HTTP_STATUSES.FORBIDDEN_403).send("incorrect deviceId") ///???
    if (dateExp < new Date()) return res.status(HTTP_STATUSES.FORBIDDEN_403).send('Incorrect date EXP') //????
    const user = await deviceRepositories.findDeviceByUserId(payload.userId)
    console.log('005-user----',user)
    if (payload.userId !== user?.userId) return res.status(HTTP_STATUSES.FORBIDDEN_403).send("Incorrect userId")
  //  req.payload = payload
    next()
}
