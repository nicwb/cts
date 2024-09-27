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
        //Arrange
        
        //Act
        const elements = [
            { locator: 'text=PPO Approval', type: 'text' },
            { locator: 'input[placeholder="PPO ID"]', type: 'input' },
            { locator: 'app-popup-table', type: 'component' },
            { locator: 'button >> text="Refresh"', type: 'button' }
        ];

        //Assert
        await Promise.all(elements.map(element =>
            expect(page.locator(element.locator)).toBeVisible()
        ));
    });

    test('should display search dialog with correct elements', async ({ page }) => {
        // Arrange
        await page.click('app-popup-table');
        
        // Act
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
    
        // Assert
        await expect(dialog.locator('label[for="float-input"]')).toHaveText('Search data');
        await expect(dialog.locator('input#float-input')).toBeVisible();

        const tableHeaders = ['PPO ID', 'Name of Pensioner', 'Mobile', 'Date of Birth', 'Date of Retirement', 'PPO No'];
        await Promise.all(tableHeaders.map(header => 
            expect(dialog.locator(`th:has-text("${header}")`)).toBeVisible()
        ));
    });
    

    test('should select PPO and display details if available', async ({ page }) => {
        // Arrange: Click to open the PPO selection dialog
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        
        // Act: Assert that the dialog is visible
        await expect(dialog).toBeVisible();
    
        const firstRow = dialog.locator('tbody tr:first-child');
    
        // Act: Click the first row if it is visible
        if (await firstRow.isVisible()) {
            await firstRow.click();
            const table = page.locator('table.table.p-datatable.p-component');
    
            // Assert: Verify that the details table is visible
            await expect(table).toBeVisible();
    
            // Assert: Verify the visibility of the expected table headers
            const expectedHeaders = [
                'PPO Id',
                'PPO Number',
                'Pensioner\'s Name',
                'Payment Mode',
                'Account Holder',
                'Bank Branch Name',
                'IFSC Code',
                'Bank Account Number',
                'Expiry Date',
                'Commencement Date'
            ];
            
            await Promise.all(expectedHeaders.map(header =>
                expect(table.locator(`th:has-text("${header}")`)).toBeVisible()
            ));
    
            // Assert: Verify that the approve button is visible
            const approveButton = dialog.locator('button:has-text("Approve")');
            await expect(approveButton).toBeVisible();
        }
    });
    

    test('should show "No records found" for invalid search', async ({ page }) => {
        // Arrange: Click to open the PPO selection dialog
        await page.click('app-popup-table');
    
        // Act: Fill the search input with a non-existent PPO number
        await page.fill('input#float-input', 'NonExistentPPO');
    
        // Assert: Verify that the "No records found" message is visible
        await expect(page.locator('text="No records found"')).toBeVisible();
    });
    

    test('should route to bank page if bank record is not available', async ({ page }) => {
        // Arrange: Open the PPO selection dialog and select the first row
        await page.click('app-popup-table');
    
        const firstRow = page.locator('tbody tr:first-child');
        if (await firstRow.isVisible()) {
            await firstRow.click();
            const ppoId = await page.locator('input[placeholder="PPO ID"]').inputValue();
            const table = page.locator('table').last();
            await expect(table).toBeVisible();
    
            // Act: Check if the PPO Id cell is visible
            const ppoIdCell = table.locator('td:has-text("PPO Id")');
            if (!(await ppoIdCell.isVisible())) {
                const message = table.locator('td:has-text("Pensioner bank account not updated")');
                if (await message.isVisible()) {
                    // Navigate to update bank account details
                    await page.click('button:has-text("Update Bank Account Details")');
                    await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/entry/${ppoId}/bank-account?returnUri=%2Fpension%2Fmodules%2Fpension-process%2Fapproval%2Fppo-approval%2F${ppoId}`);
                    await expect(page.locator('text=Bank Details')).toBeVisible();
                    await expect(page.locator('text=ID-' + ppoId)).toBeVisible();
    
                    // Assert: Verify all required fields and buttons are visible
                    await expect(page.locator('p-dropdown[formcontrolname="payMode"]')).toBeVisible();
                    await expect(page.locator('p-dropdown[formcontrolname="bank"]')).toBeVisible();
                    await expect(page.locator('input[formcontrolname="ifscCode"]')).toBeVisible();
                    await expect(page.locator('input[formcontrolname="bankAcNo"]')).toBeVisible();
    
                    const saveButton = page.locator('button:has-text("Save")');
                    await expect(saveButton).toBeVisible();
                    await expect(saveButton).toBeEnabled();
    
                    const backButton = page.locator('button:has-text("Back")');
                    await expect(backButton).toBeVisible();
                    await expect(backButton).toBeEnabled();
    
                    const nextButton = page.locator('button:has-text("Next")');
                    await expect(nextButton).toBeVisible();
                    await expect(nextButton).toBeEnabled();
    
                    // Act: Save bank account details
                    await page.click('button:has-text("Save")');
                    await waitForToastMessage(page, 'Bank account saved');
    
                    // Handle confirmation dialog
                    const dialogHeader = page.getByRole('dialog');
                    const isModalVisible = await dialogHeader.isVisible();
    
                    if (isModalVisible) {
                        await page.click('button:has-text("Yes")');
                        await expect(page).toHaveURL(`/#/pension/modules/pension-process/approval/ppo-approval/${ppoId}`);
                        await page.click('button:has-text("Approve")');
                        await page.waitForSelector('text=PPO Status Flag Set Successfully');
                    }
                }
            }
        }
    });
    

    test('should approve PPO successfully', async ({ page }) => {
        // Arrange: Open the PPO approval dialog
        await page.click('app-popup-table');
        const dialog = page.locator('.p-dialog.p-component');
        await expect(dialog).toBeVisible();
    
        const firstRow = dialog.locator('tbody tr:first-child');
        if (await firstRow.isVisible()) {
            await firstRow.click();
            const ppoId = await page.locator('input[placeholder="PPO ID"]').inputValue();
            const approveButton = dialog.locator('button:has-text("Approve")');
            await expect(approveButton).toBeVisible();
    
            // Act: Check for the presence of the bank account update button
            if (!(await page.locator('button:has-text("Update Bank Account Details")').isVisible())) {
                await expect(approveButton).toBeEnabled();
                await approveButton.click();
                // Assert: Verify success message
                await expect(page.locator('text=PPO Status Flag Set Successfully')).toBeVisible();
            } else {
                // Handle case where bank account update is required
                const message = page.locator('td:has-text("Pensioner bank account not updated")');
                await expect(message).toBeVisible();
    
                // Act: Navigate to update bank account details
                await page.click('button:has-text("Update Bank Account Details")');
                await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/entry/${ppoId}/bank-account?returnUri=%2Fpension%2Fmodules%2Fpension-process%2Fapproval%2Fppo-approval%2F${ppoId}`);
                await expect(page.locator('text=Bank Details')).toBeVisible();
                await expect(page.locator('text=ID-' + ppoId)).toBeVisible();
    
                // Assert: Check for visibility of required fields and buttons
                await expect(page.locator('p-dropdown[formcontrolname="payMode"]')).toBeVisible();
                await expect(page.locator('p-dropdown[formcontrolname="bank"]')).toBeVisible();
                await expect(page.locator('input[formcontrolname="ifscCode"]')).toBeVisible();
                await expect(page.locator('input[formcontrolname="bankAcNo"]')).toBeVisible();
    
                // Act: Save the bank account details
                const saveButton = page.locator('button:has-text("Save")');
                await expect(saveButton).toBeVisible();
                await expect(saveButton).toBeEnabled();
                await page.click('button:has-text("Save")');
                await waitForToastMessage(page, 'Bank account saved');
    
                // Handle confirmation dialog after saving
                const dialogHeader = page.getByRole('dialog');
                const isModalVisible = await dialogHeader.isVisible();
                if (isModalVisible) {
                    await page.click('button:has-text("Yes")');
                    await expect(page).toHaveURL(`/#/pension/modules/pension-process/approval/ppo-approval/${ppoId}`);
                    await page.click('button:has-text("Approve")');
                    await page.waitForSelector('text=PPO Status Flag Set Successfully');
                }
            }
        }
    });
    


});
