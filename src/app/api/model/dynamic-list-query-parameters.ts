/**
 * CTS-BE
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SortParameter } from './sort-parameter';
import { FilterParameter } from './filter-parameter';


export interface DynamicListQueryParameters { 
    listType?: string | null;
    pageSize?: number;
    pageIndex?: number;
    filterParameters?: Array<FilterParameter> | null;
    sortParameters?: SortParameter;
}

