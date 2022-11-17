import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {ipRepositories} from "../repositories/ip-db-repositories";







export const limiter = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip
    const url = req.url
    const inputDate = new Date()
    const client = await ipRepositories.createClient(ip, url, inputDate)
    if (!client) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    const limitTime = new Date(new Date().getTime() - 10000)
    const count = await ipRepositories.getCount(ip, url, limitTime)
    if(count > 5) return res.sendStatus(HTTP_STATUSES.TOO_MUCH_REQUESTS_429)
    next()
}



