import { test as base, Page } from '@playwright/test';
import { PensionModule } from './pom';
import { DotEnv } from 'utils/env';

export enum Seeders {
    DatabaseSeeder,
    AccountHeadSeeder,
    BankSeeder,
    BillSeeder,
    BranchSeeder,
    BreakupSeeder,
    CategorySeeder,
    ClassificationSeeder,
    ComponentRateSeeder,
    EppoAmountSeeder,
    EppoNomineeSeeder,
    EppoReceiptSeeder,
    EppoRevisionSeeder,
    FinancialYearSeeder,
    LifeCertificateSeeder,
    NomineeSeeder,
    PensionerSeeder,
    PpoBillSeeder,
    PpoReceiptSeeder,
    PpoSanctionDetailsSeeder,
    PrimaryCategorySeeder,
    SubCategorySeeder,
    TreasurySeeder,
}

// Create API helper function to reuse code
async function callDatabaseApi(
    page: Page,
    method: 'put' | 'delete' | 'post',
    endpoint: string
) {
    const accessToken =
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbiI6IntcIklkXCI6MyxcIk5hbWVcIjpcIkNUU1wiLFwiTGV2ZWxzXCI6W3tcIklkXCI6OCxcIk5hbWVcIjpcIlRyZWFzdXJ5XCIsXCJTY29wZVwiOltcIkRBQVwiXX1dLFwiUm9sZXNcIjpbe1wiSWRcIjoyNyxcIk5hbWVcIjpcImNsZXJrXCIsXCJQZXJtaXNzaW9uc1wiOltcImNhbi1yZWNlaXZlLWJpbGxcIl19XX0iLCJuYW1laWQiOiIzOSIsIm5hbWUiOiJDVFMgQ2xlcmsiLCJuYmYiOjE3MTc5OTY2OTksImV4cCI6MTcxODA4MzA5OSwiaWF0IjoxNzE3OTk2Njk5fQ.tLMRXKlXb2eyiE2ApSRgFgbX9EjvPbGNi1dgp_UpGadv-UitDdS4su2ZV6B4kp4Rf0TXjDQHTW7YvNkwciQVQg';

    const baseUrl = `${DotEnv.NG_APP_API_BASE_URL}/api/v1`;
    const url = endpoint.startsWith('http')
        ? endpoint
        : `${baseUrl}${endpoint}`;

    const response = await page.request[method](url, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok()) {
        throw new Error(`API call failed: ${response.status()}`);
    }

    return await response.json();
}

// Declare the types of your fixtures.
type PensionModuleFixtures = {
    pensionPage: PensionModule;
    dbUtils: {
        seedDatabase: (seeder: Seeders, count?: number) => Promise<unknown>;
        dropDatabase: () => Promise<unknown>;
        migrateDatabase: () => Promise<unknown>;
    };
};

// Extend base test by providing "pensionPage" and database utility functions
export const test = base.extend<PensionModuleFixtures>({
    pensionPage: async (
        { page, isMobile }: { page: Page; isMobile: boolean },
        use
    ) => {
        // Set up the fixture.
        const pensionPage = new PensionModule(page, isMobile);
        await use(pensionPage);
    },

    // Create a fixture that provides database utility functions
    dbUtils: async ({ page }, use) => {
        const utils = {
            seedDatabase: async (seeder: Seeders, count: number = 5) => {
                const seederName = Seeders[seeder];
                const url = `/db/seed/${seederName}/${count}`;
                return (await callDatabaseApi(page, 'put', url)) as unknown;
            },
            dropDatabase: async () => {
                return (await callDatabaseApi(
                    page,
                    'delete',
                    '/db/drop'
                )) as unknown;
            },
            migrateDatabase: async () => {
                return (await callDatabaseApi(
                    page,
                    'post',
                    '/db/migrate'
                )) as unknown;
            },
        };

        await use(utils);
    },
});

export { expect } from '@playwright/test';
