import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Regular pension bill', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if (isMobile) {
            await page.locator('button.layout-topbar-menu-button').click();
        }
        const dashboard = page.getByText('CCTSCLERK');
        await expect(dashboard).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/bill-print/regular-pension');
    });

    test('bill printing', async ({ page }) => {
        await expect (page.getByText('Month:Select a MonthYear:')).toBeVisible();
        await page.getByText('Select a Month').click();
        await page.getByLabel('January').click();
        await page.getByRole('textbox').click();
        await page.getByText('2024').click();
        await page.locator('p-radiobutton').filter({ hasText: 'All Bank/ All Category' }).locator('div').nth(2).click();
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'Generate Report' }).click();

        // Capture the download event
        const download = await downloadPromise;

        // Get the suggested filename (from the server)
        const suggestedFilename = download.suggestedFilename();

        // Define where the file will be saved (e.g., in a 'downloads' folder)
        const downloadPath = path.join(__dirname, 'downloads', suggestedFilename);

        // Save the file to the specified path
        await download.saveAs(downloadPath);

        // Verify that the file was downloaded and saved successfully
        expect(fs.existsSync(downloadPath)).toBeTruthy(); // Check if the file exists

        // Optionally, check that the file is not empty
        const fileStats = fs.statSync(downloadPath);
        expect(fileStats.size).toBeGreaterThan(0); // Ensure the file is not empty


    })

})
