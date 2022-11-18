import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {deviceQueryRepositories} from "../repositories/device-query-repositories";
import {checkPayloadTokena} from "../middlewares/check-Payload-Tokena";
import {DeviceViewModel} from "../types/device_types";
import {deviceRepositories} from "../repositories/device-db-repositories";
import {checkDeviceId} from "../middlewares/check-Device-Id";


export const securityRoute = Router({})


securityRoute.get('/devices', checkPayloadTokena, async (req: Request, res: Response<DeviceViewModel[] | null>) => {
   const devices = await deviceQueryRepositories.findDevices(req.payload.userId)
   console.log('0000-/devices ----',devices)
   if (devices) {
      res.send(devices).status(HTTP_STATUSES.OK_200) //
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
securityRoute.delete('/devices', checkPayloadTokena, async (req: Request, res: Response<boolean>) => {
   const isDeleted = await deviceRepositories.deleteDevices(req.payload)
   if (isDeleted) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
securityRoute.delete('/devices/:id', checkDeviceId, checkPayloadTokena, async (req: Request, res: Response<boolean>) => {
   const isDeleted = await deviceRepositories.deleteDeviceByDeviceId(req.params.id)
   console.log('0000-/devices/:id ----',isDeleted)
   if (isDeleted) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})