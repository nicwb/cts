/**
 * CTS-BE
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ListHeader } from './list-header';
import { ListAllPpoReceiptsResponseDTO } from './list-all-ppo-receipts-response-dto';


export interface ListAllPpoReceiptsResponseDTOIEnumerableDynamicListResult { 
    dataSource?: { [key: string]: any; } | null;
    headers?: Array<ListHeader> | null;
    data?: Array<ListAllPpoReceiptsResponseDTO> | null;
    dataCount?: number;
}

