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
import { PensionerResponseDTO } from './pensioner-response-dto';
import { PpoBillBreakupEntryDTO } from './ppo-bill-breakup-entry-dto';
import { PpoBillBreakupResponseDTO } from './ppo-bill-breakup-response-dto';


export interface PpoBillResponseDTO { 
    dataSource?: { [key: string]: any; } | null;
    pensionerId: number;
    bankAccountId: number;
    ppoId: number;
    fromDate: string;
    toDate: string;
    billType: string;
    billDate: string;
    grossAmount: number;
    byTransferAmount: number;
    netAmount: number;
    id?: number;
    breakups?: Array<PpoBillBreakupEntryDTO> | null;
    pensioner?: PensionerResponseDTO;
    ppoBillBreakups?: Array<PpoBillBreakupResponseDTO> | null;
}

