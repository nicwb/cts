/**
 * CTS-BE
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PensionBreakupResponseDTO } from './pension-breakup-response-dto';


export interface ComponentRateResponseDTO { 
    dataSource?: { [key: string]: any; } | null;
    categoryId: number;
    breakupId: number;
    effectiveFromDate: string;
    rateAmount: number;
    rateType: string;
    id?: number;
    readonly componentName?: string | null;
    readonly componentRate?: string | null;
    readonly componentType?: string | null;
    readonly withEffectFrom?: string | null;
    breakup?: PensionBreakupResponseDTO;
}

