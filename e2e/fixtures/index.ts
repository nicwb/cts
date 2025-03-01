import { test as base, Page } from '@playwright/test';
import { PensionModule } from './pom';
import { DatabaseModule } from './database';

// Declare the types of your fixtures.
type PensionModuleFixtures = {
    pensionPage: PensionModule;
    dbUtils: DatabaseModule;
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
    dbUtils: async ({ page }: { page: Page }, use) => {
        const dbUtils = new DatabaseModule(page);
        await use(dbUtils);
    },
});
export { Seeders } from './database';
export { expect } from '@playwright/test';
