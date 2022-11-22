import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-servise";


export const getUserIdFromRefreshTokena = async (req: Request, res: Response, next: NextFunction) => {
    let userId = null
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        userId = null
    } else {
        const payload = await jwtService.verifyToken(refreshToken)
        if (payload) userId = payload.userId
    }
    req.userId = userId
    next()
}
