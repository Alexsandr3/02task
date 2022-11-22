/*
export type PaginatorType <T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T
}*/


export class PaginatorType<T> {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: T
    ) {
    }
}