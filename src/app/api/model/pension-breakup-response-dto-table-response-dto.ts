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
import { PensionBreakupResponseDTO } from './pension-breakup-response-dto';


export interface PensionBreakupResponseDTOTableResponseDTO { 
    dataSource?: { [key: string]: any; } | null;
    headers?: Array<TableHeader> | null;
    data?: Array<PensionBreakupResponseDTO> | null;
    readonly dataCount?: number;
}

