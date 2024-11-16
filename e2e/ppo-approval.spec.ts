import { test } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test.skip('should approve PPO successfully', async ({ pensionPage }) => {
    // Arrange
    await pensionPage.savePpoDetailsAndApprove();
});

