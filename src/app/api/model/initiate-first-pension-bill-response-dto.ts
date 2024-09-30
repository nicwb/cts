/**
 * CTS-BE
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PensionerResponseDTO } from './pensioner-response-dto';
import { PpoBillBreakupResponseDTO } from './ppo-bill-breakup-response-dto';
import { PpoPaymentListItemDTO } from './ppo-payment-list-item-dto';


export interface InitiateFirstPensionBillResponseDTO { 
    dataSource?: { [key: string]: any; } | null;
    ppoId: number;
    id?: number;
    fromDate?: string;
    billType?: string;
    pensionerPayments?: Array<PpoPaymentListItemDTO> | null;
    ppoBillBreakups?: Array<PpoBillBreakupResponseDTO> | null;
    billGeneratedUptoDate?: string;
    toDate?: string;
    billDate?: string;
    treasuryVoucherNo?: string | null;
    treasuryVoucherId?: number;
    treasuryVoucherDate?: string;
    grossAmount?: number;
    netAmount?: number;
    preparedBy?: string | null;
    preparedOn?: string;
    readonly pensionerId?: number;
    pensioner?: PensionerResponseDTO;
}

