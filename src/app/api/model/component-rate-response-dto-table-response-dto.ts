/**
 * CTS-BE
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { TableHeader } from './table-header';
import { ComponentRateResponseDTO } from './component-rate-response-dto';


export interface ComponentRateResponseDTOTableResponseDTO { 
    dataSource?: { [key: string]: any; } | null;
    headers?: Array<TableHeader> | null;
    data?: Array<ComponentRateResponseDTO> | null;
    readonly dataCount?: number;
}
