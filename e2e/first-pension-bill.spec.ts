import { test, expect } from "./fixtures";

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('can generate first pension bill and save', async ({ pensionPage, page }) => {
    // Arrange
    const ppoId = await pensionPage.savePpoDetailsAndApprove();
    await page.goto('/pension-process/pension-bill/first-pension-bill', { waitUntil: "domcontentloaded" });
    await page.locator('p-button').getByRole('button', { name: "Open" }).click();

    let notFound = true;

    // Act
    while (notFound) {
        if (await page.getByRole('cell', { name: '' + ppoId, exact: true }).isVisible()) {
            await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
            notFound = false;
            break;
        }
        const nextButton = page.locator('p-paginator button.p-paginator-next');
        if (await nextButton.isVisible() && !(await nextButton.isDisabled())) {
            await nextButton.click();
            await page.waitForTimeout(1000);
        } else {
            break;
        }
    }

    // Assert
    if (notFound) {
        throw new Error(`PPO ID ${ppoId} not found after searching through all available pages.`);
    }

    await page.getByRole('textbox', { name: 'Select a date' }).click();
    await page.locator('.p-datepicker-today').click();
    await expect(page.getByRole('textbox', { name: 'Select a date' })).not.toBeEmpty();

    await page.getByRole('button', { name: 'Generate' }).click();
    await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();

    // Final Assert
    await expect(page.getByText('Component Detail:Component')).toBeVisible();
    await expect(page.getByText('Bill Details:Bill')).toBeVisible();
    await expect(page.getByText('Pension Details:PPO')).toBeVisible();
});
