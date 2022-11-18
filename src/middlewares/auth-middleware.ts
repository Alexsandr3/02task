import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {jwtService} from "../application/jwt-servise";
import {usersQueryRepositories} from "../repositories/users-query-repositories";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.status(HTTP_STATUSES.UNAUTHORIZED_401).send("Did not come accessToken")
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if (!userId) {
        res.status(HTTP_STATUSES.UNAUTHORIZED_401).send("Did not come userId")
        return
    }
    req.user = await usersQueryRepositories.findUserById(userId)
    next()
}