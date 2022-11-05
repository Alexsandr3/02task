import {Response, Router} from "express";
import {SortDirectionType, TypeForView} from "../types/blogs_types";
import {usersService} from "../domain/users-service";
import {
    preGetUsersValidations,
    usersValidations
} from "../middlewares/users-validation-middleware";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";
import {RequestWithBody, RequestWithParams, RequestWithQeury} from "../Req_types";
import {QueryParams_GetUsersModel} from "../models/QueryParams_GetUsersModel";
import {BodyParams_CreateUserModel} from "../models/BodyParams_CreateUserModel";
import {UsersType} from "../types/users_types";
import {URIParams_UserModel} from "../models/URIParams_UserModel";
import {usersQueryRepositories} from "../repositories/users-query-repositories";


export const usersRoute = Router({})


usersRoute.get('/', preGetUsersValidations, async (req: RequestWithQeury<QueryParams_GetUsersModel>, res: Response<TypeForView | null>) => {
    let data = req.query
    let dataForReposit = {
        searchLoginTerm: '',
        searchEmailTerm: '',
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: SortDirectionType.Desc,
        ...data,
    }
    const users = await usersQueryRepositories.findUsers(dataForReposit)
    res.send(users)
})
usersRoute.post('/', usersValidations, async (req: RequestWithBody<BodyParams_CreateUserModel>, res: Response<UsersType>) => {
    const newUser = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    return res.status(201).send(newUser)
})
usersRoute.delete('/:id',checkAutoritionMiddleware, async (req: RequestWithParams<URIParams_UserModel>, res: Response) => {
    const id = req.params.id
    const isDelete = await usersService.deleteUserById(id)
    if (!isDelete) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})