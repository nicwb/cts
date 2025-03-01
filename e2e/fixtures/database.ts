import { expect, type Page } from '@playwright/test';
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

export class DatabaseModule {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    private async callDatabaseApi(
        page: Page,
        method: 'put' | 'delete' | 'post',
        endpoint: string
    ) {
        const accessToken = `${DotEnv.NG_APP_API_TOKEN}`;
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

    async seedDatabase(seeder: Seeders, count: number = 5) {
        const seederName = Seeders[seeder];
        const url = `/db/seed/${seederName}/${count}`;
        const response = await this.callDatabaseApi(this.page, 'put', url);
        expect(response).toContain('Database seeded successfully');
    }
    async dropDatabase() {
        const response = await this.callDatabaseApi(
            this.page,
            'delete',
            '/db/drop'
        );
        expect(response).toContain('Database dropped successfully');
    }
    async migrateDatabase() {
        const response = await this.callDatabaseApi(
            this.page,
            'post',
            '/db/migrate'
        );

        expect(response).toContain('Database migrated successfully');
    }
}
