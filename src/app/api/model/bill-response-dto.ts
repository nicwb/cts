/**
 * CTS-BE
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PpoBillResponseDTO } from './ppo-bill-response-dto';


export interface BillResponseDTO { 
    dataSource?: { [key: string]: any; } | null;
    id?: number;
    financialYear?: string | null;
    hoaId?: string | null;
    billNo?: number;
    billDate?: string;
    treasuryVoucherNo?: string | null;
    treasuryVoucherDate?: string;
    fromDate?: string;
    toDate?: string;
    ppoBills?: Array<PpoBillResponseDTO> | null;
    readonly ppoBillCount?: number;
    grossAmount?: number;
    byTransferAmount?: number;
    netAmount?: number;
    preparedBy?: string | null;
    preparedOn?: string;
}

