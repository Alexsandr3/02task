import {NextFunction, Request, Response} from "express";
import {atob} from "buffer"


export const checkAutoritionMiddleware = (req: Request, res:Response,next:NextFunction) => {
    const authorization = req.header('Authorization')
    if (!authorization?.startsWith("Basic") ){
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

/*
const credentials = {
    login: 'admin',
    password: 'qwerty'
}
export const basicAutoritionMiddlewar = (req:Request, res:Response, next: NextFunction) => {
    const authHeander = req.headers['Authorization']
    const encoderAut = Buffer.from('${credentials.login}:${credentials.password}').toString('base64')

    const validHeander = 'Basic ${encoderAut}'

    if (validHeander === authHeander){
        next()
        return
    }
    res.sendStatus(401)
}
*/