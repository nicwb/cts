import { test, expect } from './fixtures';
import * as fs from 'fs';
import * as path from 'path';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToRegularPensionBillPrint();
  });

    test('Generate and verify pension bill PDF with dynamic values', async ({ page }) => {
        // ARRANGE
        // ACT
        const month = page.locator('p-dropdown[formControlName="months"]').first();
        await month.click();
        await page.getByLabel('October').click();
        await page.getByRole('textbox').click();
        await page.getByText('2024').click();

        await page.locator('p-radiobutton').filter({ hasText: 'All Bank/ All Category' }).locator('div').nth(2).click();

        await page.getByRole('button', { name: 'Generate Report' }).click();
        const dialog = page.locator('.p-dialog');

        await expect(dialog).toBeVisible();

        const dialogMessage = await dialog.innerText();

        if (dialogMessage.includes('No regular bills available for PDF generation.')) {
            //ASSERT
            expect(dialogMessage).toContain('No regular bills available for PDF generation.');

            expect(dialogMessage).toContain('Number of PPOs: 0');
            expect(dialogMessage).toContain('Total Bill Amount: ₹0.00');
        } else if (dialogMessage.includes('PDF "Regular Pension Bill')) {
           //ASSERT
            expect(dialogMessage).toContain('PDF "Regular Pension Bill for October 2024" has been generated.');

            const ppoCountMatch = dialogMessage.match(/Number of PPOs: (\d+)/);
            const totalAmountMatch = dialogMessage.match(/Total Bill Amount: ₹([\d,.]+)/);

            expect(ppoCountMatch).not.toBeNull();
            expect(totalAmountMatch).not.toBeNull();

            const ppoCount = parseInt(ppoCountMatch![1]);
            const totalAmount = parseFloat(totalAmountMatch![1].replace(/,/g, ''));

            expect(ppoCount).toBeGreaterThanOrEqual(0);
            expect(totalAmount).toBeGreaterThanOrEqual(0);

            const downloadPromise = page.waitForEvent('download');
            const download = await downloadPromise;

            const safeFilename = 'generated.pdf';
            const downloadPath = path.join(__dirname, 'downloads', safeFilename);
            await download.saveAs(downloadPath);

            expect(fs.existsSync(downloadPath)).toBeTruthy();
            const fileStats = fs.statSync(downloadPath);
            expect(fileStats.size).toBeGreaterThan(0);
        }
    });
