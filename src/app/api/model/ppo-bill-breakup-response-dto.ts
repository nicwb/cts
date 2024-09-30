/**
 * CTS-BE
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PpoComponentRevisionResponseDTO } from './ppo-component-revision-response-dto';


export interface PpoBillBreakupResponseDTO { 
    dataSource?: { [key: string]: any; } | null;
    ppoId: number;
    fromDate: string;
    toDate: string;
    breakupAmount: number;
    dueAmount?: number;
    drawnAmount?: number;
    readonly netAmount?: number;
    id?: number;
    readonly revisionId?: number;
    revision?: PpoComponentRevisionResponseDTO;
    componentName?: string | null;
    componentType?: string;
    amountPerMonth?: number;
    baseAmount?: number;
}

