import { test } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test.skip('Save PPO details', async ({ pensionPage }) => {
    // Arrange
    await pensionPage.savePpoDetails();
});
