import { test } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('should approve PPO successfully', async ({ pensionPage }) => {
    // Arrange
    const ppoId = await pensionPage.savePpoDetails();

    // Act
    await pensionPage.approvePpo(ppoId);
});

