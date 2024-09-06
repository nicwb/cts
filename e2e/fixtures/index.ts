import { test as base } from '@playwright/test';
import { PensionModule } from './pom';


// Declare the types of your fixtures.
type PensionModuleFixtures = {
  pensionPage: PensionModule;
};

// Extend base test by providing "pensionPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<PensionModuleFixtures>({
  pensionPage: async ({ page, isMobile }, use) => {

    // Set up the fixture.
    const pensionPage = new PensionModule(page, isMobile);

    // Use the fixture value in the test.
    await use(pensionPage);
  },
});
export { expect } from '@playwright/test';