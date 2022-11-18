import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {jwtService} from "../application/jwt-servise";
import {deviceRepositories} from "../repositories/device-db-repositories";


export const checkAccess = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const payload = await jwtService.verifyToken(refreshToken)
    const deviceUser = await deviceRepositories.findDeviceForValid(payload.userId, payload.deviceId, payload.iat)
    if(!deviceUser) return res.status(HTTP_STATUSES.UNAUTHORIZED_401).send('Incorrect userId or deviceId or issuedAt')
    if(deviceUser.deviceId !== req.params.id) return res.status(HTTP_STATUSES.FORBIDDEN_403).send('Incorrect deviceIdt')
    req.payload = payload
    next()
}
