import {NextFunction,Request, Response} from "express";
import {ObjectId} from "mongodb";

export const checkIdValidForMongodb = (req: Request, res: Response, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(404).send("Incorrect id,  please enter a valid one")
    } else {
        next()
    }
}
export const checkBlogIdValidForMongodb = (req: Request, res: Response, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.blogId)) {
        res.status(404).send("Incorrect blogId,  please enter a valid one")
    } else {
        next()
    }
}