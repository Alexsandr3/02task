import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {jwtService} from "../application/jwt-servise";
import {deviceRepositories} from "../repositories/device-db-repositories";


export const checkRefreshTokena = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.status(HTTP_STATUSES.UNAUTHORIZED_401).send("Did not come refreshToken")
    const payload = await jwtService.verifyToken(refreshToken)

    const dateExp = new Date(payload.exp * 1000)
    if (dateExp < new Date()) return res.status(HTTP_STATUSES.UNAUTHORIZED_401).send('Expired date')

    const deviceUser = await deviceRepositories.findDeviceForValid(payload.userId, payload.deviceId, payload.iat)
    if(!deviceUser) return res.status(HTTP_STATUSES.UNAUTHORIZED_401).send('Incorrect userId or deviceId or issuedAt')
    if(deviceUser.deviceId !== payload.deviceId) return res.status(HTTP_STATUSES.FORBIDDEN_403).send('Incorrect deviceIdt')
    req.payload = payload
    next()
}
