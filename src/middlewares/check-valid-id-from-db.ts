import {NextFunction,Request, Response} from "express";
import {ObjectId} from "mongodb";
import {HTTP_STATUSES} from "../const/HTTP response status codes";

export const checkIdValidForMongodb = (req: Request, res: Response, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(HTTP_STATUSES.NOT_FOUND_404).send("Incorrect id,  please enter a valid one")
    } else {
        next()
    }
}
export const checkBlogIdValidForMongodb = (req: Request, res: Response, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.blogId)) {
        res.status(HTTP_STATUSES.NOT_FOUND_404).send("Incorrect blogId,  please enter a valid one")
    } else {
        next()
    }
}