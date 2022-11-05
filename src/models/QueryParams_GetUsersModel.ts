import {SortDirectionType} from "../types/blogs_types";

export type QueryParams_GetUsersModel = {
    /**
     * Search term for user Login: Login should contain this term in any position
     */
    searchLoginTerm?: string
    /**
     *  Search term for user Email: Email should contains this term in any position
     */
    searchEmailTerm?: string
    /**
     *  pageNumber is number of portions that should be returned
     */
    pageNumber?: number
    /**
     * pageSize is portions size that should be returned
     */
    pageSize?: number
    /**
     * Sort by parameters
     */
    sortBy?: string
    /**
     * Sort by desc or asc
     */
    sortDirection?: SortDirectionType    //asc or desc
}
