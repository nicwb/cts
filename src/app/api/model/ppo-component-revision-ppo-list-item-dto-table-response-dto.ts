/**
 * CTS-BE
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PpoComponentRevisionPpoListItemDTO } from './ppo-component-revision-ppo-list-item-dto';
import { TableHeader } from './table-header';


export interface PpoComponentRevisionPpoListItemDTOTableResponseDTO { 
    dataSource?: { [key: string]: any; } | null;
    headers?: Array<TableHeader> | null;
    data?: Array<PpoComponentRevisionPpoListItemDTO> | null;
    readonly dataCount?: number;
}

