/**
 * CTS-BE
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface PpoSanctionDetailsResponseDTO { 
    dataSource?: { [key: string]: any; } | null;
    ppoId: number;
    pensionerId: number;
    employeeName: string;
    sanctionAuthority: string;
    sanctionNo: string;
    sanctionDate: string;
    employeeDob?: string;
    employeeGender?: string | null;
    employeeDateOfAppointment?: string;
    employeeOffice?: string | null;
    employeeDesignation?: string | null;
    employeeLastPay?: number | null;
    averageEmolument?: number | null;
    employeeHrmsId?: string | null;
    issuingAuthority?: string | null;
    issuingLetterNo?: string | null;
    issuingLetterDate?: string;
    qualifyingServiceGrossYears?: number | null;
    qualifyingServiceGrossMonths?: number | null;
    qualifyingServiceGrossDays?: number | null;
    qualifyingServiceNetYears?: number | null;
    qualifyingServiceNetMonths?: number | null;
    qualifyingServiceNetDays?: number | null;
    id?: number;
}

