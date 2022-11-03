import {Request, Response, Router} from "express";
import {SortDirectionType} from "../repositories/blogs-db-repositories";
import {usersService} from "../domain/users-service";
import {
    preUsersGetValidations,
    preUsersValidations,
    usersValidations
} from "../middlewares/users-validation-middleware";
import {checkAutoritionMiddleware} from "../middlewares/check-autorition-middleware";


export const usersRoute = Router({})

usersRoute.get('/', preUsersGetValidations, async (req: Request, res: Response) => {
    let data = req.query
    let dataForReposit = {
        searchLoginTerm: '',
        searchEmailTerm: '',
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc' as SortDirectionType,
        ...data,
    }
    const users = await usersService.findUsers(dataForReposit)
    res.send(users)
})
usersRoute.post('/', usersValidations, async (req: Request, res: Response) => {
    const newUser = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    return res.status(201).send(newUser)
})
usersRoute.delete('/:id',checkAutoritionMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id
    const isDelete = await usersService.deleteUserById(id)
    if (!isDelete) {
        res.sendStatus(404)
    } else {
        res.send(204)
    }
})