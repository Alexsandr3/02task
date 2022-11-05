import {SortDirectionType} from "../types/blogs_types";

export type QueryParams_GetBlogsModel = {
    /**
     *  Search term for blog Name: Name should contain this term in any position
     */
    searchNameTerm?: string
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
    sortDirection?: SortDirectionType   //asc or desc
}
