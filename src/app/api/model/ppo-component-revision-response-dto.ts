/**
 * CTS-BE
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ComponentRateResponseDTO } from './component-rate-response-dto';


export interface PpoComponentRevisionResponseDTO { 
    dataSource?: { [key: string]: any; } | null;
    rateId: number;
    fromDate: string;
    amountPerMonth: number;
    id?: number;
    toDate?: string;
    rate?: ComponentRateResponseDTO;
}

