import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {HTTP_STATUSES} from "../const/HTTP response status codes";

export const inputValidetionsMiddleware = (req:Request, res:Response,next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsCrudes = errors.array({onlyFirstError:true}).map(e => {
            return {
                message: e.msg,
                field: e.param
            }
        })
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({"errorsMessages": errorsCrudes})
    }
    next()
}