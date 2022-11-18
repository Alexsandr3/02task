import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {deviceQueryRepositories} from "../repositories/device-query-repositories";
import {checkRefreshTokena} from "../middlewares/check-refresh-tokena";
import {DeviceViewModel} from "../types/device_types";
import {deviceRepositories} from "../repositories/device-db-repositories";
import {validDeviceId} from "../middlewares/valid-device-Id";
import {checkRefreshAndIdTokena} from "../middlewares/check-refresh-id-tokena";


export const securityRoute = Router({})


securityRoute.get('/devices', checkRefreshTokena, async (req: Request, res: Response<DeviceViewModel[] | null>) => {
   const devices = await deviceQueryRepositories.findDevicesSessions(req.payload.userId)
   if (devices) {
      res.send(devices).status(HTTP_STATUSES.OK_200) 
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
securityRoute.delete('/devices', checkRefreshTokena, async (req: Request, res: Response<boolean>) => {
   const isDeleted = await deviceRepositories.deleteDevices(req.payload)
   if (isDeleted) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
securityRoute.delete('/devices/:id', validDeviceId, checkRefreshAndIdTokena, async (req: Request, res: Response<boolean>) => {
   const isDeleted = await deviceRepositories.deleteDeviceByDeviceId(req.params.id)
   if (isDeleted) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})