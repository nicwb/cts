import { test as base, Page } from '@playwright/test';
import { PensionModule } from './pom';

// Declare the types of your fixtures.
type PensionModuleFixtures = {
    pensionPage: PensionModule;
    deactivateResponse: any;
};

// Extend base test by providing "pensionPage" and "deactivateResponse".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<PensionModuleFixtures>({
    pensionPage: async (
        { page, isMobile }: { page: Page; isMobile: boolean },
        use: (value: PensionModule) => Promise<void>
    ) => {
        // Set up the fixture.
        const pensionPage = new PensionModule(page, isMobile);

        // Use the fixture value in the test.
        await use(pensionPage);
    },
    deactivateResponse: async (
        { page }: { page: Page },
        use: (value: any) => Promise<void>
    ) => {
        // Make the GET API call to deactivate unused PPO receipts
        const response = await page.request.get(
            'http://api.docker.test/api/v1/manual-ppo/receipts/unused/deactivate'
        );

        // Ensure the response is successful
        if (!response.ok()) {
            throw new Error(
                `Failed to deactivate unused PPO receipts: ${response.status()}`
            );
        }

        // Parse the response JSON
        const data = await response.json();

        // Use the data in the tests
        await use(data);
    },
});

export { expect } from '@playwright/test';
