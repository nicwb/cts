import { test, expect } from '@playwright/test';
import { DotEnv } from "utils/env"

test.describe('Manual PPO Receipt Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        await expect(page.getByRole('link', { name: 'logo | CTS' })).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/ppo/manualPpoReceipt');
    });

    test('should display the "New Manual PPO Entry" button', async ({ page }) => {
        const newEntryButton = page.locator('button:has-text("New Manual PPO Entry")');
        await expect(newEntryButton).toBeVisible();
    });

    test('should open the modal when "New Manual PPO Entry" button is clicked', async ({ page }) => {
        await page.click('button:has-text("New Manual PPO Entry")');
        const possibleSelectors = [
            'p-dialog',
            '.p-dialog',
            '.modal',
            '.dialog',
            '[role="dialog"]',
            '#manualPpoDialog',
            'div:has-text("Manual PPO Receipt")',
            '.p-dialog-content',
            '.p-dialog-header',
        ];

        let modalElement = null;

        for (const selector of possibleSelectors) {
            const element = page.locator(selector);
            const count = await element.count();
            if (count > 0) {
                const isVisible = await element.isVisible();
                if (isVisible) {
                    modalElement = element;
                    break;
                }
            }
        }

        if (modalElement) {
            try {
                const modalHTML = await modalElement.evaluate(el => el.outerHTML);
            } catch (error) {
                console.error('Error while waiting for modal to be visible:', error);
                throw error;
            }
        } else {
            const bodyHTML = await page.evaluate(() => document.body.outerHTML);
            throw new Error('Modal dialog not found');
        }
    });

    test('should fill out the form and submit successfully', async ({ page }) => {
        await page.click('button:has-text("New Manual PPO Entry")');
        await page.click('button:has-text("Submit")');
        const successMessage = page.locator('text=PPO Receipt added successfully');
        await expect(successMessage).toBeVisible();
    });

    test('should display error for duplicate PPO number', async ({ page }) => {
        await page.click('button:has-text("New Manual PPO Entry")');
        const ppoNo = await page.getByText('PPO-').first().innerText();
        await page.fill('input[formControlName="ppoNo"]', ppoNo);
        await page.click('button:has-text("Submit")');
        const errorMessage = page.locator('small.p-error:has-text("This PPO number already exists. Please use a different PPO number.")');
        await expect(errorMessage).toBeVisible();
    });

    test('should display ui after clicking cancel button', async ({ page }) => {
        await page.click('button:has-text("New Manual PPO Entry")');
        await page.click('button:has-text("Cancel")');
        const newEntryButton = page.locator('button:has-text("New Manual PPO Entry")');
        await expect(newEntryButton).toBeVisible();
    });

    test('should perform search and update table results', async ({ page }) => {
        const tableLocator = page.locator('mh-prime-dynamic-table');
        const searchInput = page.locator('mh-prime-dynamic-table input[placeholder="Search"]');
        await expect(searchInput).toBeVisible();
        const searchTerm = 'DAA2024000001'; 
        await searchInput.fill(searchTerm);
        const searchIconButton = page.locator('mh-prime-dynamic-table button[icon="pi pi-search"]');
        await searchIconButton.click();
        const rowSelector = 'tbody.p-element.p-datatable-tbody';
        const rowElements = await page.$$(rowSelector);
        const manualRowCount = rowElements.length;
        if (manualRowCount > 0) {
            const firstRowText = await rowElements[0].innerText();
            expect(firstRowText).toContain(searchTerm);
        } else {
            const successMessage = page.locator('text=An error occurred');
            await expect(successMessage).toBeVisible();
        }
        await page.screenshot({ path: DotEnv.NG_APP_PLAYWRIGHT_SCREENSHOT_DIR + '/after_search.png' });
    });


    test('should load the table with data', async ({ page }) => {
        const table = page.locator('mh-prime-dynamic-table');
        await expect(table).toBeVisible();
    });


    test('should edit an existing entry', async ({ page }) => {
        await page.waitForSelector('tbody.p-element.p-datatable-tbody', { state: 'attached', timeout: 10000 });
        await page.click('td.ng-star-inserted button:has-text("Edit")');
        await page.fill('input[formControlName="pensionerName"]', 'Raj Roy');
        await page.click('button:has-text("Update")');
        const successMessage = page.locator('text=PPO Receipt added successfully');
        await expect(successMessage).toBeVisible();
    });

    test('should change table query to display different number of rows', async ({ page }) => {
        await page.waitForSelector('mh-prime-dynamic-table', { state: 'visible', timeout: 10000 });

        const rowOptions = [10, 30, 50];

        for (const option of rowOptions) {
            const dropdownTrigger = page.locator('p-dropdown .p-dropdown-trigger');
            await dropdownTrigger.click();
            const optionLocator = page.locator(`li[aria-label="${option}"]`);
            await optionLocator.click();
            await page.waitForTimeout(2000);
            const rows = page.locator('mh-prime-dynamic-table .p-datatable-row');
            const rowCount = await rows.count();
            expect(rowCount).toBeLessThanOrEqual(option);
            const selectedValue = await page.locator('p-dropdown .p-dropdown-label').textContent();
            expect(selectedValue?.trim()).toBe(option.toString());
        }
    });


    test('debug: log HTML and take screenshot', async ({ page }) => {
        await page.waitForTimeout(10000);

        await page.screenshot({ path: DotEnv.NG_APP_PLAYWRIGHT_SCREENSHOT_DIR + '/debug-screenshot.png', fullPage: true });
    });
});
