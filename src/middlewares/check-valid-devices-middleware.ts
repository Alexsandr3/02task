import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {jwtService} from "../application/jwt-servise";
import {deviceRepositories} from "../repositories/device-db-repositories";


export const checkValidDeviceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    const payload = await jwtService.verifyToken(refreshToken)
    const user = await deviceRepositories.findDeviceByUserId(payload.userId)
    const dateExp = new Date(payload.exp)
    if (dateExp < new Date()) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
    if (payload.deviceId !== req.params.id) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    if (payload.userId !== user?.userId) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
    req.payload = payload
    next()
}
