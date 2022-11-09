import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {loginValidations} from "../middlewares/auth_login-validation-middleware";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {RequestWithBody} from "../Req_types";
import {BodyParams_GetUserModel} from "../models/BodyParams_GetUserModel";
import {authMiddleware} from "../middlewares/auth-middleware";
import {usersQueryRepositories} from "../repositories/users-query-repositories";




export const authRoute = Router({})


authRoute.post('/login',loginValidations, async (req: RequestWithBody<BodyParams_GetUserModel>, res: Response) => {
   const token =  await usersService.checkCredentials(req.body.login, req.body.password)
   if (token) {
      res.send(token)
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
authRoute.get('/me', authMiddleware, async (req: Request, res: Response) => {
   const result = await usersQueryRepositories.getUserById(req.user.id)
   return res.send(result)
})