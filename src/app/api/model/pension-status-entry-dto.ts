/**
 * CTS-BE
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PensionStatusFlag } from './pension-status-flag';


export interface PensionStatusEntryDTO { 
    dataSource?: { [key: string]: any; } | null;
    statusFlag: PensionStatusFlag;
    statusWef: string;
    ppoId: number;
}
export namespace PensionStatusEntryDTO {
}


