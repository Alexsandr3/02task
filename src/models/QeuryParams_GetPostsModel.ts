import {SortDirectionType} from "../repositories/blogs-db-repositories";

export type QeuryParams_GetPostsModel = {
    /**
     * pageNumber is number of portions that should be returned
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
    sortDirection?: SortDirectionType  //asc or desc
}