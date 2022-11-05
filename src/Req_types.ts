import {Request} from 'express'

export type RequestWithBody<T> = Request<{},{},T>
export type RequestWithQeury<T> = Request<{},{},{},T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndQeury<P,T> = Request<P,{},{},T>
export type RequestWithParamsAndBody<P,T> = Request<P,{},T,{}>