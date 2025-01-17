import { PensionManualPPOReceiptService } from 'src/app/api';
import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('Navigation Service', async ({ pensionPage, page }) => {
    // Delete all unused manual PPO receipts
    const pensionManualPPOReceiptService = new PensionManualPPOReceiptService();
    await pensionManualPPOReceiptService.deactivateUnusedPpoReceipts();

    await page.goto('pension-process/ppo/entry', {
        waitUntil: 'domcontentloaded',
    });
    const addNewButton = page.getByRole('button', { name: 'Add New PPO' });
    await addNewButton.click();

    const messageLocator = page.locator(
        'text="No manual ppo receipt found!. Do you want add it?"'
    );
    await expect(messageLocator).toBeVisible();
    await page.getByRole('button', { name: 'Yes' }).click();
    expect(page.url()).toContain(
        'pension-process/ppo/ppo-receipt/new?returnUri=pension-process%2Fppo%2Fentry%2Fnew'
    );
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('button', { name: 'Yes' })).toBeVisible();
    await page.getByRole('button', { name: 'Yes' }).click();
    expect(page.url()).toContain('pension-process/ppo/entry/new');
    await page.getByRole('button', { name: 'Save' }).click();
    await pensionPage.okSuccess();
});
