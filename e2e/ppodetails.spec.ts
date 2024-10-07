import { test, expect } from "./fixtures";

test.beforeEach(async ({ pensionPage }) => {
    test.fixme(true, 'Remove this line after task-241 is merged');
    await pensionPage.staticLogin();
});

test("Save PPO details", async ({ pensionPage, page }) => {
    // Arrange
    await pensionPage.savePpoReceipt();

    // Act
    await page.goto('/#/pension/modules/pension-process/ppo/entry', { waitUntil: "domcontentloaded"});
    const addNewButton = page.getByRole('button', { name: 'Add New PPO' });
    await addNewButton.click();
    await expect(async () => {
        await expect(page.locator('div').filter({ hasText: /^Address:$/ }).getByRole('textbox')).not.toBeEmpty();
    }).toPass({
        // intervals: [2_00, 5_00, 8_00],
        timeout: 20_000
    });
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByLabel('Account No', { exact: true })).not.toBeEmpty();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    // Assert
    await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
});
