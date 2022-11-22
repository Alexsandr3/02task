import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {jwtService} from "../application/jwt-servise";
import {usersQueryRepositories} from "../composition-root";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.status(HTTP_STATUSES.UNAUTHORIZED_401).send("Did not come accessToken")
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    console.log('1-=-=token-=-=-', token)
    const userId = await jwtService.getUserIdByToken(token)
    console.log('3-=-=userId-=-=-', userId)
    if (!userId) {
        res.status(HTTP_STATUSES.UNAUTHORIZED_401).send("Did not come userId")
        return
    }
    req.user = await usersQueryRepositories.findUserById(userId)
    next()
}