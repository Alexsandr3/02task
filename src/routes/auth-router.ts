import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {loginValidations} from "../middlewares/auth_login-validation-middleware";

export const authRoute = Router({})


authRoute.post('/',loginValidations, async (req: Request, res: Response) => {
   const user =  await usersService.checkCredentials(req.body.login, req.body.password)
   if (!user) {
      return res.sendStatus(401)
   } else {
      return res.sendStatus(204)
   }
})