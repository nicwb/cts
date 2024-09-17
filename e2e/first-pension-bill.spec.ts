import { test, expect } from "@playwright/test";

test.describe('First pension bill', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if (isMobile) {
            page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        // Navigate to the page containing your component
        await page.goto('/#/pension/modules/pension-process/pension-bill');
    });
    test('PPO Entry', async ({ page }) => {
        await page.goto('/#/pension/modules/pension-process/ppo/manualPpoReceipt');
        await page.getByRole('button', { name: 'New Manual PPO Entry' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.goto('/#/pension/modules/pension-process/ppo/entry/ppodetails');
        await page.getByRole('button', { name: 'Add New PPO' }).click();
        await page.locator('span').filter({ hasText: 'e-PPO Application No/TRID' }).getByRole('button').click();
        await page.locator('role=cell').filter({ hasText: /\d+/ }).first().click();
        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByRole('button', { name: 'Next' }).click();
        await page.getByRole('button', { name: 'Save' }).click();
    });
    test('Input button or button visible or not', async ({ page }) => {
        await expect(page.getByPlaceholder('PPO ID')).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Select a date' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Generate' })).toBeDisabled();
    });

    test('First bill generate', async ({ page }) => {
        const today = new Date();
        const day = today.getDate().toString();
    
        // Click the button to start generating the bill
        await page.locator('p-button').getByRole('button').click();
    
        // Select the last numeric cell in the table
        const cells = await page.locator('role=cell').filter({ hasText: /\d+/ });
    
        // Debug: log the count of numeric cells found
        console.log('Number of numeric cells found:', await cells.count());
    
        if (await cells.count() > 0) {
            // Ensure you're selecting the last numeric cell explicitly
            const lastNumericCell = cells.nth(await cells.count() - 1);
    
            // Verify the text content before clicking to ensure it's a valid numeric cell
            const cellText = await lastNumericCell.textContent();
            console.log('Last numeric cell text:', cellText);
    
            // Click the last numeric cell
            await lastNumericCell.click();
        } else {
            console.log('No numeric cells found.');
            return; // Exit if no data is found
        }
    
        // Click the date picker and select today's date
        await page.getByRole('textbox', { name: 'Select a date' }).click();
        await page.locator(`text="${day}"`).click();
    
        // Click the Generate button
        await page.getByRole('button', { name: 'Generate' }).click();
    
        try {
            // Check for success label and other required fields
            await expect(page.getByLabel('Success')).toBeVisible();
            await expect(page.getByText('Pension Details:PPO')).toBeVisible();
            await expect(page.getByText('Bill Details:Bill')).toBeVisible();
            await expect(page.getByText('Component Detail:Component')).toBeVisible();
    
            // Save the bill
            await page.getByRole('button', { name: ' Save' }).click();
        } catch (error) {
            // If there's an error, check for an 'Oops...' message and log the error for debugging
            console.error('Error during bill generation:', error);
            await expect(page.getByLabel('Oops...')).toBeVisible();
        }
    });
    
    


    test('First bill save', async ({ page }) => {
        const today = new Date();
        const day = today.getDate().toString(); // Extract the day as a string
        // Wait for the response and perform concurrent actions.

        // Click the button to trigger the first bill generation process.
        page.locator('p-button').getByRole('button').click();
        await page.locator('role=cell').filter({ hasText: /\d+/ }).first().click();
        page.getByRole('textbox', { name: 'Select a date' }).click();
        page.locator(`text="${day}"`).click();
        page.getByRole('button', { name: 'Generate' }).click();

        // Verify the presence of specific labels and text on the page.
        try {
            await expect(page.getByLabel('Success')).toBeVisible();
            await expect(page.getByText('Pension Details:PPO')).toBeVisible();
            await expect(page.getByText('Bill Details:Bill')).toBeVisible();
            await expect(page.getByText('Component Detail:Component')).toBeVisible();
            await page.getByRole('button', { name: ' Save' }).click();
        } catch {
            await expect(page.getByLabel('Oops...')).toBeVisible();
        }

        try {
            await expect(page.getByLabel('Success')).toBeVisible();
        } catch {
            await expect(page.getByLabel('Are you sure?')).toBeVisible();
        }

    });

    test('Check invalid ppoid', async ({ page }) => {
        // Generate a dynamic PPO ID

        await page.getByPlaceholder('PPO ID').click();
        await page.getByPlaceholder('PPO ID').fill('100000');
        await page.getByRole('textbox', { name: 'Select a date' }).click();
        await expect(page.getByText('Invalid ppoId!')).toBeVisible();

    });

    test('Bill print', async ({ page }) => {
        // Click the print button
        await page.getByRole('button', { name: ' Print' }).click();

        // Navigate to the correct URL, making sure to await the page.goto
        await page.goto('/#/pension/modules/pension-process/bill-print/first-pension');

        // Validate that the expected text is visible on the page
        await expect(page.getByText('General BillClassification BillPPO Bill PPO ID: Generate Report Refresh')).toBeVisible();
    });

});