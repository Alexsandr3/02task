import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {loginValidations} from "../middlewares/auth_login-validation-middleware";
import {HTTP_STATUSES} from "../const/HTTP response status codes";

export const authRoute = Router({})


authRoute.post('/login',loginValidations, async (req: Request, res: Response) => {
   const user =  await usersService.checkCredentials(req.body.login, req.body.password)
   if (!user) {
      return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   } else {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   }
})