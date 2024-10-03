import { error } from 'console';
import {test, expect} from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

    test('should display static UI elements correctly', async ({ page }) => {
        //Arrange
        await page.goto('/#/pension/modules/pension-process/pensioner-details/revision', { waitUntil: "domcontentloaded"});
        //Act
        const elements = [
            { locator: 'text=Revision of Component', type: 'text' , exact: true},
            { locator: 'text=Pensioner\'s Details :', type: 'text' },
            { locator: 'text=PPO ID', type: 'text' },
            { locator: 'input[placeholder="PPO ID"]', type: 'input' },
            { locator: 'app-popup-table', type: 'component' },
            { locator: 'text=PPO Number', type: 'text' },
            { locator: 'text=Pensioner Name', type: 'text' },
            { locator: 'text=Category Description', type: 'text' },
            { locator: 'text=Bank', type: 'text' },
        ];
        //Assert
        for (const element of elements) {
            await expect(page.locator(element.locator)).toBeVisible();
        }
    });

    test('should retrieve first pension bill', async ({ page, pensionPage }) => {
        const ppoId = await pensionPage.savePpoDetailsAndApprove();
        await page.goto('/#/pension/modules/pension-process/pension-bill', { waitUntil: "domcontentloaded"});
        await page.locator('p-button').getByRole('button', {name: "Open"}).click();
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        await page.getByRole('textbox', { name: 'Select a date' }).click();
        await page.locator('.p-datepicker-today').click();
        await expect(page.getByRole('textbox', { name: 'Select a date' })).not.toBeEmpty();
        
        await page.getByRole('button', { name: 'Generate' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();

        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();
        
        // Assert
        await expect(page.getByText('Component Detail:Component')).toBeVisible();
        await expect(page.getByText('Bill Details:Bill')).toBeVisible();
        await expect(page.getByText('Pension Details:PPO')).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/pensioner-details/revision', { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(100);
        await expect(page.url()).toContain('/pension/modules/pension-process/pensioner-details/revision');
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
    
        await expect(dialog.locator('label[for="float-input"]')).toHaveText('Search data');
        await expect(dialog.locator('input#float-input')).toBeVisible();
    
        const tableHeaders = ['PPO ID', 'Name of Pensioner', 'Mobile', 'Date of Birth', 'Date of Retirement', 'PPO No'];
        await Promise.all(tableHeaders.map(header =>
            expect(dialog.locator(`th:has-text("${header}")`)).toBeVisible()
        ));
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        const successMessage = page.locator('text=First Pension Bill retrieved sucessfully!');
        await expect(successMessage).toBeVisible();
        await page.click('button:has-text("Ok")');
    });
    
    test('should refresh the retrieved first pension bill', async ({ page, pensionPage }) => {
        const ppoId = await pensionPage.savePpoDetailsAndApprove();
        await page.goto('/#/pension/modules/pension-process/pension-bill', { waitUntil: "domcontentloaded"});
        await page.locator('p-button').getByRole('button', {name: "Open"}).click();
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        await page.getByRole('textbox', { name: 'Select a date' }).click();
        await page.locator('.p-datepicker-today').click();
        await expect(page.getByRole('textbox', { name: 'Select a date' })).not.toBeEmpty();
        
        await page.getByRole('button', { name: 'Generate' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();

        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();
        
        // Assert
        await expect(page.getByText('Component Detail:Component')).toBeVisible();
        await expect(page.getByText('Bill Details:Bill')).toBeVisible();
        await expect(page.getByText('Pension Details:PPO')).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/pensioner-details/revision', { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(100);
        await expect(page.url()).toContain('/pension/modules/pension-process/pensioner-details/revision');
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
    
        await expect(dialog.locator('label[for="float-input"]')).toHaveText('Search data');
        await expect(dialog.locator('input#float-input')).toBeVisible();
    
        const tableHeaders = ['PPO ID', 'Name of Pensioner', 'Mobile', 'Date of Birth', 'Date of Retirement', 'PPO No'];
        await Promise.all(tableHeaders.map(header =>
            expect(dialog.locator(`th:has-text("${header}")`)).toBeVisible()
        ));
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        const successMessage = page.locator('text=First Pension Bill retrieved sucessfully!');
        await expect(successMessage).toBeVisible();
        await page.click('button:has-text("Ok")');
    
        // Clicking the Refresh button and validating that all fields are cleared
        await page.getByRole('button', { name: ' Refresh' }).click();
        
        await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue('');
        await expect(page.locator('input[id="pensionerName"]')).toHaveValue('');
        await expect(page.locator('[id="Category\\ Description"]')).toHaveValue('');
        await expect(page.locator('[id="bankName"]')).toHaveValue('');
    });

    test('should receive all component Revision Details', async ({ page, pensionPage }) => {
        const ppoId = await pensionPage.savePpoDetailsAndApprove();
        await page.goto('/#/pension/modules/pension-process/pension-bill', { waitUntil: "domcontentloaded"});
        await page.locator('p-button').getByRole('button', {name: "Open"}).click();
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        await page.getByRole('textbox', { name: 'Select a date' }).click();
        await page.locator('.p-datepicker-today').click();
        await expect(page.getByRole('textbox', { name: 'Select a date' })).not.toBeEmpty();
        
        await page.getByRole('button', { name: 'Generate' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();

        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();
        
        // Assert
        await expect(page.getByText('Component Detail:Component')).toBeVisible();
        await expect(page.getByText('Bill Details:Bill')).toBeVisible();
        await expect(page.getByText('Pension Details:PPO')).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/pensioner-details/revision', { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(100);
        await expect(page.url()).toContain('/pension/modules/pension-process/pensioner-details/revision');
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
    
        await expect(dialog.locator('label[for="float-input"]')).toHaveText('Search data');
        await expect(dialog.locator('input#float-input')).toBeVisible();
    
        const tableHeaders = ['PPO ID', 'Name of Pensioner', 'Mobile', 'Date of Birth', 'Date of Retirement', 'PPO No'];
        await Promise.all(tableHeaders.map(header =>
            expect(dialog.locator(`th:has-text("${header}")`)).toBeVisible()
        ));
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        const successMessage = page.locator('text=First Pension Bill retrieved sucessfully!');
        await expect(successMessage).toBeVisible();
        await page.click('button:has-text("Ok")');
    
        // Click on the Search button and verify the success message
        await page.getByRole('button', { name: ' Search' }).click();
        const successMessage2 = page.locator('text=All Component Revision Details Received Successfully!');
        await expect(successMessage2).toBeVisible();
        await page.click('button:has-text("Ok")');
        
        // Verify the table and its headers
        const table = page.locator('p-table.p-element');
        await expect(table).toBeVisible();
    });
    

    test('should edit component Revision Details', async ({ page, pensionPage }) => {
        const ppoId = await pensionPage.savePpoDetailsAndApprove();
        await page.goto('/#/pension/modules/pension-process/pension-bill', { waitUntil: "domcontentloaded"});
        await page.locator('p-button').getByRole('button', {name: "Open"}).click();
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        await page.getByRole('textbox', { name: 'Select a date' }).click();
        await page.locator('.p-datepicker-today').click();
        await expect(page.getByRole('textbox', { name: 'Select a date' })).not.toBeEmpty();
        
        await page.getByRole('button', { name: 'Generate' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();

        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();
        
        // Assert
        await expect(page.getByText('Component Detail:Component')).toBeVisible();
        await expect(page.getByText('Bill Details:Bill')).toBeVisible();
        await expect(page.getByText('Pension Details:PPO')).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/pensioner-details/revision', { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(100);
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
    
        await expect(dialog.locator('label[for="float-input"]')).toHaveText('Search data');
        await expect(dialog.locator('input#float-input')).toBeVisible();
    
        const tableHeaders = ['PPO ID', 'Name of Pensioner', 'Mobile', 'Date of Birth', 'Date of Retirement', 'PPO No'];
        await Promise.all(tableHeaders.map(header =>
            expect(dialog.locator(`th:has-text("${header}")`)).toBeVisible()
        ));
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        const successMessage = page.locator('text=First Pension Bill retrieved sucessfully!');
        await expect(successMessage).toBeVisible();
        await page.click('button:has-text("Ok")');
    
        // Click on the Search button
        await page.getByRole('button', { name: ' Search' }).click();
        const successMessage2 = page.locator('text=All Component Revision Details Received Successfully!');
        await expect(successMessage2).toBeVisible();
        await page.click('button:has-text("Ok")');
        
        // Verify the table is visible
        const table = page.locator('p-table.p-element');
        await expect(table).toBeVisible();
        
        // Click on the first edit button in the table
        if(await page.getByRole('button', { name: 'Edit' }).first().isVisible()){
            await page.getByRole('button', { name: 'Edit' }).first().click();
        } else{
        await page.getByRole('row').getByRole('button').first().click();
        }
    
        // Edit the amount
        const amountInput = page.locator('input[formControlName="amountPerMonth"]').first();
        await amountInput.fill('1500');
    
        // Save the changes
        if(await page.getByRole('button', { name: 'Save' }).isVisible()){
            await page.getByRole('button', { name: 'Save' }).click();
        } else{
        await page.getByRole('row').getByRole('button').nth(2).click();
        }
        const successMessage3 = page.locator('text=Component Revision saved sucessfully!');
        await expect(successMessage3).toBeVisible();
    });
    

    test('should delete a component Revision Detail', async ({ page, pensionPage }) => {
        const ppoId = await pensionPage.savePpoDetailsAndApprove();
        await page.goto('/#/pension/modules/pension-process/pension-bill', { waitUntil: "domcontentloaded"});
        await page.locator('p-button').getByRole('button', {name: "Open"}).click();
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        await page.getByRole('textbox', { name: 'Select a date' }).click();
        await page.locator('.p-datepicker-today').click();
        await expect(page.getByRole('textbox', { name: 'Select a date' })).not.toBeEmpty();
        
        await page.getByRole('button', { name: 'Generate' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();

        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();
        
        // Assert
        await expect(page.getByText('Component Detail:Component')).toBeVisible();
        await expect(page.getByText('Bill Details:Bill')).toBeVisible();
        await expect(page.getByText('Pension Details:PPO')).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/pensioner-details/revision', { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(100);
        await expect(page.url()).toContain('/pension/modules/pension-process/pensioner-details/revision');
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
    
        await expect(dialog.locator('label[for="float-input"]')).toHaveText('Search data');
        await expect(dialog.locator('input#float-input')).toBeVisible();
    
        const tableHeaders = ['PPO ID', 'Name of Pensioner', 'Mobile', 'Date of Birth', 'Date of Retirement', 'PPO No'];
        await Promise.all(tableHeaders.map(header =>
            expect(dialog.locator(`th:has-text("${header}")`)).toBeVisible()
        ));
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        const successMessage = page.locator('text=First Pension Bill retrieved sucessfully!');
        await expect(successMessage).toBeVisible();
        await page.click('button:has-text("Ok")');
    
        // Click on the Search button
        await page.getByRole('button', { name: ' Search' }).click();
        const successMessage2 = page.locator('text=All Component Revision Details Received Successfully!');
        await expect(successMessage2).toBeVisible();
        await page.click('button:has-text("Ok")');
        
        // Verify the table is visible
        const table = page.locator('p-table.p-element');
        await expect(table).toBeVisible();
        
        // Click on the second button (Delete button) in the first row
        await page.getByRole('row').getByRole('button').nth(1).click();
    
        // Confirm deletion in the dialog
        const dialog2 = page.locator('div[role="dialog"]');
        await expect(dialog2).toBeVisible();
        await page.getByRole('button', { name: 'Yes, delete it!' }).click();
    
        // Verify deletion success message
        const successMessage3 = page.locator('text=Your file has been deleted.');
        await expect(successMessage3).toBeVisible();
    });
    
    test('should create a new component revision', async ({ page, pensionPage }) => {
        const ppoId = await pensionPage.savePpoDetailsAndApprove();
        await page.goto('/#/pension/modules/pension-process/pension-bill', { waitUntil: "domcontentloaded"});
        await page.locator('p-button').getByRole('button', {name: "Open"}).click();
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        await page.getByRole('textbox', { name: 'Select a date' }).click();
        await page.locator('.p-datepicker-today').click();
        await expect(page.getByRole('textbox', { name: 'Select a date' })).not.toBeEmpty();
        
        await page.getByRole('button', { name: 'Generate' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();

        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();
        
        // Assert
        await expect(page.getByText('Component Detail:Component')).toBeVisible();
        await expect(page.getByText('Bill Details:Bill')).toBeVisible();
        await expect(page.getByText('Pension Details:PPO')).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/pensioner-details/revision', { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(100);
        await expect(page.url()).toContain('/pension/modules/pension-process/pensioner-details/revision');
        await page.click('app-popup-table');
        const dialog1 = page.locator('div[role="dialog"]');
        await expect(dialog1).toBeVisible();
    
        await expect(dialog1.locator('label[for="float-input"]')).toHaveText('Search data');
        await expect(dialog1.locator('input#float-input')).toBeVisible();
    
        const tableHeaders = ['PPO ID', 'Name of Pensioner', 'Mobile', 'Date of Birth', 'Date of Retirement', 'PPO No'];
        await Promise.all(tableHeaders.map(header =>
            expect(dialog1.locator(`th:has-text("${header}")`)).toBeVisible()
        ));
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        const successMessage1 = page.locator('text=First Pension Bill retrieved sucessfully!');
        await expect(successMessage1).toBeVisible();
        await page.click('button:has-text("Ok")');
        
        // Click on the Search button
        await page.getByRole('button', { name: ' Search' }).click();
        const successMessage2 = page.locator('text=All Component Revision Details Received Successfully!');
        await expect(successMessage2).toBeVisible();
        await page.click('button:has-text("Ok")');
        
        // Add a new component revision
        await page.getByRole('button', { name: ' Add' }).click();
        
        const componentNameInput = page.locator('input[formControlName="componentname"]');
        const fromDateInput = page.locator('input[placeholder="dd/mm/yyyy"]');
        const amountInput = page.locator('input[formControlName="amount"]');
        
        await expect(fromDateInput).toBeVisible();
    
        // Click the app-popup-table to bring up the selection again
        await page.click('app-popup-table');
        await page.waitForSelector('tbody tr');
        
        // Select the first row again or similar selection logic
        const firstRow2 = dialog1.locator('tbody tr:first-child');
        const componentName = await firstRow2.locator('td:nth-child(2)').textContent();
        await firstRow2.click();
        
        // Fill in the form with the selected component name and random data
        await expect(componentNameInput).toHaveValue(componentName ?? '');
        await page.click('input[placeholder="dd/mm/yyyy"]');
        await page.click('.p-datepicker-calendar tbody tr:nth-child(1) td:nth-child(' + (Math.floor(Math.random() * 7) + 1) + ')');
        
        const randomAmount = (Math.floor(Math.random() * (9999 - 100 + 1)) + 100).toString();
        await amountInput.fill(randomAmount);
        
        // Submit the form
        await page.getByRole('button', { name: 'Submit' }).click(); 
        
        const successMessage3 = page.locator('text=PPO Component Revision saved sucessfully!');
        await expect(successMessage3).toBeVisible();
    });
    