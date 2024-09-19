import { test, expect } from '@playwright/test';

test.describe('PPO Approval', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        test.fixme(true, 'Fix the tests to handle empty list of PPOs for approval');
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if(isMobile) {
            page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/approval/ppo-approval');
    });
    
    test('should display static UI elements correctly', async ({ page }) => {
        const elements = [
            { locator: 'text=PPO Approval', type: 'text' },
            { locator: 'input[placeholder="PPO ID"]', type: 'input' },
            { locator: 'app-search-popup', type: 'component' },
            { locator: 'button >> text="Approve"', type: 'button' },
            { locator: 'button >> text="Refresh"', type: 'button' }
        ];
        
        for (const element of elements) {
            await expect(page.locator(element.locator)).toBeVisible();
        }
    });
    
    
    test('should display search dialog with correct elements', async ({ page }) => {
        await page.click('app-search-popup');
        const dialog = page.locator('div[role="dialog"]');
        await page.waitForTimeout(500);
        await expect(dialog).toBeVisible();
        
        await expect(dialog.locator('label[for="float-input"]')).toHaveText('Search data');
        await expect(dialog.locator('input#float-input')).toBeVisible();
        
        const tableHeaders = ['PPO ID', 'Name of Pensioner', 'Mobile', 'Date of Birth', 'Date of Retirement', 'PPO No'];
        for (const header of tableHeaders) {
            await expect(dialog.locator(`th:has-text("${header}")`)).toBeVisible();
        }
    });
    
    test('should select PPO and display details', async ({ page }) => {
        await page.click('app-search-popup');
        const dialog = page.locator('div[role="dialog"]');
        await page.waitForTimeout(500);
        await expect(dialog).toBeVisible();
        await page.waitForTimeout(500);
        await page.waitForSelector('tbody tr');
        const firstRow = dialog.locator('tbody tr:first-child');
        const ppoIdValue = await firstRow.locator('td:first-child').textContent();
        await firstRow.click();
        await page.waitForTimeout(500);
        const table = page.locator('table.table.p-datatable.p-component');
        await expect(table).toBeVisible();
        
        const expectedHeaders = ['PPO Id', 'PPO Number', 'Pensioner\'s Name', 'Payment Mode', 'Account Holder', 'Bank Branch Name', 'IFSC Code', 'Bank Account Number', 'Expiry Date', 'Commencement Date'];
        for (const header of expectedHeaders) {
            await expect(table.locator(`th:has-text("${header}")`)).toBeVisible();
        }
    });
    
    test('should refresh page and clear PPO ID', async ({ page }) => {
        await page.click('app-search-popup');
        const dialog = page.locator('.p-dialog.p-component');
        await expect(dialog).toBeVisible();
        const firstRow = dialog.locator('tbody tr:first-child');
        await page.waitForTimeout(500);
        await expect(firstRow).toBeVisible(); 
        await firstRow.click();
        const ppoIdCell = firstRow.locator('td').first(); 
        const ppoIdValue = await ppoIdCell.textContent();
        const closeButton = dialog.locator('.p-dialog-header-close-icon.pi.pi-times').nth(0);
        await closeButton.click();
        await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue(ppoIdValue?.trim() ?? '');
        
        await page.click('button:has-text("Refresh")');
        
        await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue('');
    });
    
    
    
    
    
    test('should show "No records found" for invalid search', async ({ page }) => {
        await page.waitForTimeout(500);
        await page.click('app-search-popup');
        await page.waitForTimeout(500);
        await page.fill('input#float-input', 'NonExistentPPO');
        await expect(page.locator('text="No records found"')).toBeVisible();
    });
    
    
    test('should approve PPO successfully', async ({ page }) => {
        await page.click('app-search-popup');
        const dialog = page.locator('.p-dialog.p-component');
        await expect(dialog).toBeVisible();
        const firstRow = dialog.locator('tbody tr:first-child');
        await expect(firstRow).toBeVisible(); 
        await firstRow.click();
        const ppoIdCell = firstRow.locator('td').first(); 
        const ppoIdValue = await ppoIdCell.textContent();
        const closeButton = dialog.locator('.p-dialog-header-close-icon.pi.pi-times').nth(0);
        await closeButton.click();
        await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue(ppoIdValue?.trim() ?? '');
        await page.click('button:has-text("Approve")');
        await expect(page.locator('text=PPO Approved successfully')).toBeVisible();
    });
    
    test.skip('should route to bank page if bank record is not available', async ({ page }) => {
        await page.click('app-search-popup');
        await page.waitForTimeout(500);
        await page.waitForSelector('tbody tr');
        await page.locator('tbody tr:first-child').click();
        const ppoId = await page.locator('input[placeholder="PPO ID"]').inputValue();
        const table = page.locator('table').last();
        await expect(table).toBeVisible();
        const tableHeaders = ['PPO Id', 'PPO Number', 'Pensioner\'s Name', 'Payment Mode', 'Account Holder', 'Bank Branch Name','IFSC Code','Bank Account Number','Expiry Date','Commencement Date'];
        for (const header of tableHeaders) {
            await expect(table.locator(`th:has-text("${header}")`)).toBeVisible();
        }
        
        const ppoIdCell = table.locator('td:has-text("PPO Id")');
        if (await ppoIdCell.isVisible()) {
            const ppoNumberCell = table.locator('td:has-text("PPO Number")');
            await expect(ppoNumberCell).toBeVisible();
        } else {
            const message = table.locator('td:has-text("Pensioner bank account not updated")');
            if (await message.isVisible()) {
                await page.click('button:has-text("Update Bank Account Details")');
                await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/entry/${ppoId}/bank-account`);
            } 
        }
    });
    
});