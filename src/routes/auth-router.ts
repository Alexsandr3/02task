import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {emailValidations, loginValidations, passwordValidations} from "../middlewares/auth_login-validation-middleware";
import {HTTP_STATUSES} from "../const/HTTP response status codes";
import {RequestWithBody} from "../types/Req_types";
import {BodyParams_LoginInputModel} from "../models/BodyParams_LoginInputModel";
import {authMiddleware} from "../middlewares/auth-Headers-Validations-Middleware";
import {usersQueryRepositories} from "../repositories/users-query-repositories";
import {
   BodyParams_RegistrationEmailResendingInputModel
} from "../models/BodyParams_RegistrationConfirmationCodeInputModel";
import {
   BodyParams_RegistrationConfirmationCodeInputModel
} from "../models/BodyParams_RegistrationEmailResendingInputModel";
import {BodyParams_UserInputModel} from "../models/BodyParams_UserInputModel";
import {usersAccountValidations} from "../middlewares/users-validation-middleware";
import {MeViewModel} from "../types/users_types";
import {checkRefreshTokena} from "../middlewares/check-refresh-tokena";
import {limiter} from "../middlewares/limiter-middleware";
import {BodyParams_RecoveryInputModel} from "../models/BodyParams_RecoveryInputModel";
import {BodyParams_PasswordRecoveryInputModel} from "../models/BodyParams_PasswordRecoveryInputModel";


export const authRoute = Router({})

authRoute.post('/login', limiter, loginValidations, async (req: RequestWithBody<BodyParams_LoginInputModel>, res: Response) => {
   const ipAddress = req.ip
   const deviceName = req.headers["user-agent"]
   const token = await usersService.login(req.body.loginOrEmail, req.body.password, ipAddress, deviceName!)
   if (token) {
      res.cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true});
      res.send({'accessToken': token.accessToken})
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
authRoute.post('/password-recovery', limiter, emailValidations, async (req: RequestWithBody<BodyParams_RecoveryInputModel>, res: Response) => {
   const result = await usersService.recoveryEmail(req.body.email)
   if (result) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send('Email has invalid')
   }
})
authRoute.post('/new-password', limiter, passwordValidations, async (req: RequestWithBody<BodyParams_PasswordRecoveryInputModel>, res: Response) => {
   const result = await usersService.recoveryByCode(req.body.newPassword, req.body.recoveryCode)
   if (result) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send("Code is incorrect or expired")
   }
})
authRoute.post('/refresh-token', checkRefreshTokena, async (req: Request, res: Response) => {
   const token = await usersService.refreshToken(req.payload)
   if (token) {
      res.cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true});
      res.send({'accessToken': token.accessToken})
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
authRoute.post('/registration-confirmation', limiter, async (req: RequestWithBody<BodyParams_RegistrationConfirmationCodeInputModel>, res: Response) => {
   const result = await usersService.confirmByCode(req.body.code)
   if (result) {
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
authRoute.post('/registration', limiter, usersAccountValidations, async (req: RequestWithBody<BodyParams_UserInputModel>, res: Response) => {
   const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)
   if (user) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send({})
   }
})
authRoute.post('/registration-email-resending', limiter, async (req: RequestWithBody<BodyParams_RegistrationEmailResendingInputModel>, res: Response) => {
   const result = await usersService.resendingEmail(req.body.email)
   if (result) {
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
authRoute.post('/logout', checkRefreshTokena, async (req: Request, res: Response) => {
   const token = await usersService.verifyTokenForDeleteDevice(req.payload)
   if (token) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
   }
})
authRoute.get('/me', authMiddleware, async (req: Request, res: Response<MeViewModel | null>) => {
   const result = await usersQueryRepositories.getUserById(req.user.id)
   return res.send(result)
})
