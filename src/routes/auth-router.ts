import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {loginValidations} from "../middlewares/auth_login-validation-middleware";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {RequestWithBody} from "../Req_types";
import {BodyParams_LoginInputModel} from "../models/BodyParams_LoginInputModel";
import {authMiddleware} from "../middlewares/auth-middleware";
import {usersQueryRepositories} from "../repositories/users-query-repositories";
import {
   BodyParams_RegistrationEmailResendingInputModel
} from "../models/BodyParams_RegistrationConfirmationCodeInputModel";
import {
   BodyParams_RegistrationConfirmationCodeInputModel
} from "../models/BodyParams_RegistrationEmailResendingInputModel";
import {BodyParams_UserInputModel} from "../models/BodyParams_UserInputModel";
import {usersAccountValidations} from "../middlewares/users-validation-middleware";


export const authRoute = Router({})


authRoute.post('/login',loginValidations, async (req: RequestWithBody<BodyParams_LoginInputModel>, res: Response) => {
   const token =  await usersService.checkCredentials(req.body.login, req.body.password)
   console.log('000 - token', token)
   if (token) {
      res.cookie('refreshToken',token.refreshToken,{httpOnly:true, secure: true});
      res.send({'accessToken': token.accessToken})

   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
authRoute.post('/refresh-token', async (req: Request, res: Response) => {
   console.log('token', req.cookies)
   const refreshToken = req.cookies.refreshToken
   const token =  await usersService.verifyToken(refreshToken)
   if (token) {
      res.cookie('refreshToken',token.refreshToken,{httpOnly:true, secure: true});
      res.send({'accessToken': token.accessToken})

   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
authRoute.post('/registration-confirmation', async (req: RequestWithBody<BodyParams_RegistrationConfirmationCodeInputModel>, res: Response) => {
   const result = await usersService.confirmByCode(req.body.code)
   if(result){
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
         "errorsMessages": [
            {
               "message": "Invalid code or you are already registered",
               "field": "code"
            }
         ]
      })
   }
})
authRoute.post('/registration',  usersAccountValidations, async (req: RequestWithBody<BodyParams_UserInputModel>, res: Response) => {
   const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)
   console.log('003 user|', user)
   if(user){
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send({})
   }

})
authRoute.post('/registration-email-resending',async (req: RequestWithBody<BodyParams_RegistrationEmailResendingInputModel>, res: Response) => {
   const result = await usersService.resendingEmail(req.body.email)
   if(result){
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
         "errorsMessages": [
            {
               "message": "This email is already registered))",
               "field": "email"
            }
         ]
      })
   }
})
authRoute.post('/logout',async (req: Request, res: Response) => {
   const refreshToken = req.cookies.refreshToken
   const token =  await usersService.verifyTokenForAddBlackList(refreshToken)

   if (token) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
authRoute.get('/me', authMiddleware, async (req: Request, res: Response) => {
   const result = await usersQueryRepositories.getUserById(req.user.id)
   return res.send(result)
})