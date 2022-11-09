import {UsersType} from "./users_types";

declare global {
    declare namespace Express {
        export interface Request {
            user: UsersType | null
        }
    }
}