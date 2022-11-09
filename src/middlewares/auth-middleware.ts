import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {jwtService} from "../application/jwt-servise";
import {usersQueryRepositories} from "../repositories/users-query-repositories";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if (!userId) {
        res.send(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    req.user = await usersQueryRepositories.findUserById(userId)
    next()
}