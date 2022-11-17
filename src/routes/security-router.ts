import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {deviceQueryRepositories} from "../repositories/device-query-repositories";
import {checkRefreshTokenMiddleware} from "../middlewares/refreshtoken-middleware";
import {DeviceViewModel} from "../types/device_types";
import {deviceRepositories} from "../repositories/device-db-repositories";
import {checkValidDeviceMiddleware} from "../middlewares/check-valid-devices-middleware";


export const securityRoute = Router({})


securityRoute.get('/devices', checkRefreshTokenMiddleware, async (req: Request, res: Response<DeviceViewModel[] | null>) => {
   const devices = await deviceQueryRepositories.findDevices(req.payload.userId)
   if (devices) {
      res.send(devices).status(HTTP_STATUSES.OK_200) //
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
securityRoute.delete('/devices', checkRefreshTokenMiddleware, async (req: Request, res: Response<boolean>) => {
   const isDelete = await deviceRepositories.deleteDevices(req.payload)
   if (isDelete) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
securityRoute.delete('/devices/:id', checkValidDeviceMiddleware, async (req: Request, res: Response<boolean>) => {
   const devices = await deviceRepositories.deleteDeviceByDeviceId(req.params.id)
   if (devices) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})