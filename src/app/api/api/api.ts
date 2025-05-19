export * from './database-management.service';
import { DatabaseManagementService } from './database-management.service';
export * from './message-queue.service';
import { MessageQueueService } from './message-queue.service';
export * from './pension.service';
import { PensionService } from './pension.service';
export * from './pension-auth.service';
import { PensionAuthService } from './pension-auth.service';
export * from './pension-bank-branch.service';
import { PensionBankBranchService } from './pension-bank-branch.service';
export * from './pension-by-transfer-head.service';
import { PensionByTransferHeadService } from './pension-by-transfer-head.service';
export * from './pension-category-master.service';
import { PensionCategoryMasterService } from './pension-category-master.service';
export * from './pension-component.service';
import { PensionComponentService } from './pension-component.service';
export * from './pension-component-rate.service';
import { PensionComponentRateService } from './pension-component-rate.service';
export * from './pension-component-revision.service';
import { PensionComponentRevisionService } from './pension-component-revision.service';
export * from './pension-convert-to-family-pension.service';
import { PensionConvertToFamilyPensionService } from './pension-convert-to-family-pension.service';
export * from './pension-eppo-receipt.service';
import { PensionEPPOReceiptService } from './pension-eppo-receipt.service';
export * from './pension-factory.service';
import { PensionFactoryService } from './pension-factory.service';
export * from './pension-file-storage.service';
import { PensionFileStorageService } from './pension-file-storage.service';
export * from './pension-first-bill.service';
import { PensionFirstBillService } from './pension-first-bill.service';
export * from './pension-life-certificate.service';
import { PensionLifeCertificateService } from './pension-life-certificate.service';
export * from './pension-manual-ppo-receipt.service';
import { PensionManualPPOReceiptService } from './pension-manual-ppo-receipt.service';
export * from './pension-nominee-details.service';
import { PensionNomineeDetailsService } from './pension-nominee-details.service';
export * from './pension-ppoby-transfer.service';
import { PensionPPOByTransferService } from './pension-ppoby-transfer.service';
export * from './pension-ppo-details.service';
import { PensionPPODetailsService } from './pension-ppo-details.service';
export * from './pension-ppo-status.service';
import { PensionPPOStatusService } from './pension-ppo-status.service';
export * from './pension-payment-history.service';
import { PensionPaymentHistoryService } from './pension-payment-history.service';
export * from './pension-regular-bill.service';
import { PensionRegularBillService } from './pension-regular-bill.service';
export * from './pension-sanction-details.service';
import { PensionSanctionDetailsService } from './pension-sanction-details.service';
export const APIS = [
    DatabaseManagementService,
    MessageQueueService,
    PensionService,
    PensionAuthService,
    PensionBankBranchService,
    PensionByTransferHeadService,
    PensionCategoryMasterService,
    PensionComponentService,
    PensionComponentRateService,
    PensionComponentRevisionService,
    PensionConvertToFamilyPensionService,
    PensionEPPOReceiptService,
    PensionFactoryService,
    PensionFileStorageService,
    PensionFirstBillService,
    PensionLifeCertificateService,
    PensionManualPPOReceiptService,
    PensionNomineeDetailsService,
    PensionPPOByTransferService,
    PensionPPODetailsService,
    PensionPPOStatusService,
    PensionPaymentHistoryService,
    PensionRegularBillService,
    PensionSanctionDetailsService,
];
