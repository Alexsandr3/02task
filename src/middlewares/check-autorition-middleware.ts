import {NextFunction, Request, Response} from "express";
import {atob} from "buffer"


export const checkAutoritionMiddleware = (req: Request, res:Response,next:NextFunction) => {
    const authorization = req.header('Authorization')
    if (!authorization?.startsWith("Basic") /*|| authorization?.indexof(":") > -1*/){
        return res.sendStatus(401);
    }
    try{
        const [login,passwords] = atob(authorization?.split(" ")[1]).split(":")  // decode the string
        // создание исключения
        if (login !== "admin" || passwords !== "qwerty"){
            return res.sendStatus(401)
        } else {
            next();
        }
    } catch (e) {
        // инструкции для обработки ошибок
        return res.sendStatus(401)
    }
}