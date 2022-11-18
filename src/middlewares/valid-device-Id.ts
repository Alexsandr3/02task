import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {deviceRepositories} from "../repositories/device-db-repositories";


export const validDeviceId = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) return res.status(HTTP_STATUSES.NOT_FOUND_404).send("Did not come id in Url_params")
    const isValidDeviceId = await deviceRepositories.findDeviceByDeviceId(req.params.id)
    if (!isValidDeviceId) return res.status(HTTP_STATUSES.NOT_FOUND_404).send("Incorrect device by Url_params")
    next()
}
