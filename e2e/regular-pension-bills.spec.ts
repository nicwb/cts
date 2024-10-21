import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Regular pension bill PDF generation', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        await page.goto('/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if (isMobile) {
            await page.locator('button.layout-topbar-menu-button').click();
        }
        const dashboard = page.getByText('CCTSCLERK');
        await expect(dashboard).toBeVisible();
        await page.goto('/pension-process/bill-print/regular-pension-bill-print');
    });

    test('Generate and verify pension bill PDF with dynamic values', async ({ page }) => {
        await expect(page.getByText('Month')).toBeVisible();
        await expect(page.getByText('Year:')).toBeVisible();

        // Select month and year
        const month = page.locator('p-dropdown[formControlName="months"]').first();
        await month.click();
        await page.getByLabel('October').click();
        await page.getByRole('textbox').click();
        await page.getByText('2024').click();

        // Select radio button for All Bank / All Category
        await page.locator('p-radiobutton').filter({ hasText: 'All Bank/ All Category' }).locator('div').nth(2).click();

        // Click "Generate Report" button to trigger PDF generation or dialog display
        await page.getByRole('button', { name: 'Generate Report' }).click();

        // Wait for the dialog to appear
        const dialog = page.locator('.p-dialog');

        await expect(dialog).toBeVisible();

        // Extract the dialog message
        const dialogMessage = await dialog.innerText();

        if (dialogMessage.includes('No regular bills available for PDF generation.')) {
            // Case 1: No regular bills available
            expect(dialogMessage).toContain('No regular bills available for PDF generation.');

            // Verify other details in the dialog
            expect(dialogMessage).toContain('Number of PPOs: 0');
            expect(dialogMessage).toContain('Total Bill Amount: ₹0.00');
        } else if (dialogMessage.includes('PDF "Regular Pension Bill')) {
            // Case 2: PDF is generated
            expect(dialogMessage).toContain('PDF "Regular Pension Bill for October 2024" has been generated.');

            // Extract the dynamic values of PPO count and total amount
            const ppoCountMatch = dialogMessage.match(/Number of PPOs: (\d+)/);
            const totalAmountMatch = dialogMessage.match(/Total Bill Amount: ₹([\d,.]+)/);

            // Ensure that PPO count and total amount are found in the dialog
            expect(ppoCountMatch).not.toBeNull();
            expect(totalAmountMatch).not.toBeNull();

            const ppoCount = parseInt(ppoCountMatch![1]);
            const totalAmount = parseFloat(totalAmountMatch![1].replace(/,/g, ''));

            // Optionally, assert that the extracted values are valid (e.g., PPO count is non-negative, amount is not negative)
            expect(ppoCount).toBeGreaterThanOrEqual(0);
            expect(totalAmount).toBeGreaterThanOrEqual(0);

            // Additional verification steps if required (e.g., saving the PDF)
            const downloadPromise = page.waitForEvent('download');
            const download = await downloadPromise;

            // Use a simple filename for saving the PDF
            const safeFilename = 'generated.pdf';
            const downloadPath = path.join(__dirname, 'downloads', safeFilename);
            await download.saveAs(downloadPath);

            // Verify that the file was downloaded and saved successfully
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            const fileStats = fs.statSync(downloadPath);
            expect(fileStats.size).toBeGreaterThan(0); // Ensure the file is not empty
        }
    });
});
