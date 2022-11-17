import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {jwtService} from "../application/jwt-servise";
import {deviceRepositories} from "../repositories/device-db-repositories";


export const checkRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    const payload = await jwtService.verifyToken(refreshToken)
    if (!payload.userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    const user = await deviceRepositories.findDeviceByUserId(payload.userId)
    if (payload.userId !== user?.userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    req.payload = payload
    next()
}
