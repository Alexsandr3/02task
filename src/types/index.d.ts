import {UsersType} from "./users_types";
import {PayloadType} from "../repositories/device-db-repositories";

declare global {
    declare namespace Express {
        export interface Request {
            user: UsersType | null
        }
    }
}

declare global {
    declare namespace Express {
        export interface Request {
            payload: PayloadType
        }
    }
}