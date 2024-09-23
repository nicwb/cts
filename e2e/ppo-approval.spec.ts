import { test, expect, Page } from '@playwright/test';

async function waitForToastMessage(page: Page, expectedText: string, timeout = 5000): Promise<void> {
    await page.waitForFunction(
      (text) => {
        const toasts = Array.from(document.querySelectorAll('.p-toast-message-text'));
        return toasts.some(toast => toast.textContent?.includes(text));
      },
      expectedText,
      { timeout }
    );
  }

test.describe('PPO Approval', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if(isMobile) {
            await page.locator('button.layout-topbar-menu-button').click();
        }
        await expect(page.getByText(`CCTSCLERK`)).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/approval/ppo-approval');
    });
    
    test('should display static UI elements correctly', async ({ page }) => {
        const elements = [
            { locator: 'text=PPO Approval', type: 'text' },
            { locator: 'input[placeholder="PPO ID"]', type: 'input' },
            { locator: 'app-popup-table', type: 'component' },
            { locator: 'button >> text="Refresh"', type: 'button' }
        ];
        
        await Promise.all(elements.map(element => 
            expect(page.locator(element.locator)).toBeVisible()
        ));
    });
    
    test('should handle empty list of PPOs', async ({ page }) => {
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
        
        const noRecordsMessage = dialog.locator('text="No records found"');
        if (await noRecordsMessage.isVisible()) {
            await expect(noRecordsMessage).toBeVisible();
            await expect(dialog.locator('tbody tr')).toHaveCount(0);
        }
        else {
            test.skip();
        }
    });
    
    test('should display search dialog with correct elements', async ({ page }) => {
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
        
        await expect(dialog.locator('label[for="float-input"]')).toHaveText('Search data');
        await expect(dialog.locator('input#float-input')).toBeVisible();
        
        const tableHeaders = ['PPO ID', 'Name of Pensioner', 'Mobile', 'Date of Birth', 'Date of Retirement', 'PPO No'];
        await Promise.all(tableHeaders.map(header => 
            expect(dialog.locator(`th:has-text("${header}")`)).toBeVisible()
        ));
    });
    
    test('should select PPO and display details if available', async ({ page }) => {
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
        
        const firstRow = dialog.locator('tbody tr:first-child');
        if (await firstRow.isVisible()) {
            await firstRow.click();
            const table = page.locator('table.table.p-datatable.p-component');
            await expect(table).toBeVisible();
            
            const expectedHeaders = ['PPO Id', 'PPO Number', 'Pensioner\'s Name', 'Payment Mode', 'Account Holder', 'Bank Branch Name', 'IFSC Code', 'Bank Account Number', 'Expiry Date', 'Commencement Date'];
            await Promise.all(expectedHeaders.map(header => 
                expect(table.locator(`th:has-text("${header}")`)).toBeVisible()
            ));
            const approveButton = dialog.locator('button:has-text("Approve")');
            await expect(approveButton).toBeVisible();
        }
    });
    
    test('should show "No records found" for invalid search', async ({ page }) => {
        await page.click('app-popup-table');
        await page.fill('input#float-input', 'NonExistentPPO');
        await expect(page.locator('text="No records found"')).toBeVisible();
    });

    test('should route to bank page if bank record is not available', async ({ page }) => {
        await page.click('app-popup-table');
        
        const firstRow = page.locator('tbody tr:first-child');
        if (await firstRow.isVisible()) {
            await firstRow.click();
            const ppoId = await page.locator('input[placeholder="PPO ID"]').inputValue();
            const table = page.locator('table').last();
            await expect(table).toBeVisible();
            
            const ppoIdCell = table.locator('td:has-text("PPO Id")');
            if (!(await ppoIdCell.isVisible())) {
                const message = table.locator('td:has-text("Pensioner bank account not updated")');
                if (await message.isVisible()) {
                    await page.click('button:has-text("Update Bank Account Details")');
                    await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/entry/${ppoId}/bank-account?returnUri=%2Fpension%2Fmodules%2Fpension-process%2Fapproval%2Fppo-approval%2F${ppoId}`);
                    await expect(page.locator('text=ID-'+ppoId)).toBeVisible(); 

                    const saveButton = page.locator('button:has-text("Save")');
                    await expect(saveButton).toBeVisible();

                    await page.click('button:has-text("Save")');
                    await waitForToastMessage(page, 'Bank account saved');
                    const dialogHeader = page.getByRole('dialog');
                    const isModalVisible = await dialogHeader.isVisible();
                    if (isModalVisible) {
                        await page.click('button:has-text("Yes")');
                        await expect(page).toHaveURL(`/#/pension/modules/pension-process/approval/ppo-approval/${ppoId}`);
                        await page.click('button:has-text("Approve")');
                        await page.waitForSelector('text=PPO Status Flag Set Successfully');
                    }
                } else {
                    await page.click('button:has-text("Approve")');
                    await page.waitForSelector('text=PPO Status Flag Set Successfully');
                }
            } 
        }else{
            test.skip();
        }
    });
    
    test('should approve PPO successfully', async ({ page }) => {
        await page.click('app-popup-table');
        const dialog = page.locator('.p-dialog.p-component');
        await expect(dialog).toBeVisible();
        
        const firstRow = dialog.locator('tbody tr:first-child');
        if (await firstRow.isVisible()) {
            await firstRow.click();
            const ppoId = await page.locator('input[placeholder="PPO ID"]').inputValue();
            const approveButton = dialog.locator('button:has-text("Approve")');
            await expect(approveButton).toBeVisible();
            if(!(await page.locator('button:has-text("Update Bank Account Details")').isVisible())) {       
                await expect(approveButton).toBeEnabled();
                await approveButton.click();
                await expect(page.locator('text=PPO Status Flag Set Successfully')).toBeVisible();
            }
            else {
                const message = page.locator('td:has-text("Pensioner bank account not updated")');
                await message.isVisible();
                await page.click('button:has-text("Update Bank Account Details")');
                await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/entry/${ppoId}/bank-account?returnUri=%2Fpension%2Fmodules%2Fpension-process%2Fapproval%2Fppo-approval%2F${ppoId}`);
                await expect(page.locator('text=ID-'+ppoId)).toBeVisible(); 

                const saveButton = page.locator('button:has-text("Save")');
                await expect(saveButton).toBeVisible();

                await page.click('button:has-text("Save")');
                await waitForToastMessage(page, 'Bank account saved');
                const dialogHeader = page.getByRole('dialog');
                const isModalVisible = await dialogHeader.isVisible();
      
                if (isModalVisible) {
                    await page.click('button:has-text("Yes")');
                    await expect(page).toHaveURL(`/#/pension/modules/pension-process/approval/ppo-approval/${ppoId}`);
                    await page.click('button:has-text("Approve")');
                    await page.waitForSelector('text=PPO Status Flag Set Successfully');
                }
            }
        } else {
            test.skip();
        }
    });
    
    
});