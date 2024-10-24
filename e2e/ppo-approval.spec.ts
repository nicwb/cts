import { test } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('should approve PPO successfully', async ({ pensionPage }) => {
    // Arrange
    await pensionPage.savePpoDetailsAndApprove();
});

