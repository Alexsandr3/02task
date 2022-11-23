import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-servise";


export const getUserIdFromRefreshTokena = async (req: Request, res: Response, next: NextFunction) => {
    let userId = null

    if (!req.headers.authorization) {
       userId = null
    } else {
        const token = req.headers.authorization.split(' ')[1]
        const payload = await jwtService.verifyToken(token)
        if (payload) userId = payload.userId
    }
    req.userId = userId
    next()

}
