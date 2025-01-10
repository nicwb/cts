export interface FilterParameter {
    field: string;
    value: string;
    operator: string;
}

export interface SortParameter {
    field: string;
    order: string;
}

export interface Payload {
    pageSize: number;
    pageIndex: number;
    filterParameters: FilterParameter[];
    sortParameters: SortParameter;
}
