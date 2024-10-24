import {test, expect} from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

    test('should reset the retrieved first pension bill', async ({ page, pensionPage }) => {
        //Arrange
        await pensionPage.shouldRetrieveFirstPensionBill();
        //Act
        await page.getByRole('button', { name: ' Reset' }).click();
        //Assert
        await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue('');
        await expect(page.locator('input[id="pensionerName"]')).toHaveValue('');
        await expect(page.locator('[id="Category\\ Description"]')).toHaveValue('');
        await expect(page.locator('[id="bankName"]')).toHaveValue('');
    });

    test('should receive all component Revision Details', async ({ page, pensionPage }) => {
        //Arrange
        await pensionPage.shouldRetrieveFirstPensionBill();
        //Act
        await page.getByRole('button', { name: ' Search' }).click();
        await pensionPage.okSuccess();
        //Assert
        const table = page.locator('p-table.p-element');
        await expect(table).toBeVisible();
    });


    test('should edit component Revision Details', async ({ page, pensionPage }) => {
        //Arrange
        await pensionPage.shouldRetrieveFirstPensionBill();
        await page.getByRole('button', { name: ' Search' }).click();
        await pensionPage.okSuccess();
        //Act
        const table = page.locator('p-table.p-element');
        await expect(table).toBeVisible();
        if(await page.getByRole('button', { name: 'Edit' }).first().isVisible()){
            await page.getByRole('button', { name: 'Edit' }).first().click();
        } else{
        await page.getByRole('row').getByRole('button').first().click();
        }
        const amountInput = page.locator('input[formControlName="amountPerMonth"]').first();
        await amountInput.fill('1500');
        if(await page.getByRole('button', { name: 'Save' }).isVisible()){
            await page.getByRole('button', { name: 'Save' }).click();
        } else{
        await page.getByRole('row').getByRole('button').nth(2).click();
        }
        //Assert
        await pensionPage.okSuccess();
    });


    test('should delete a component Revision Detail', async ({ page, pensionPage }) => {
        //Arrange
        await pensionPage.shouldRetrieveFirstPensionBill();
        await page.getByRole('button', { name: ' Search' }).click();
        await pensionPage.okSuccess();
        //Act
        const table = page.locator('p-table.p-element');
        await expect(table).toBeVisible();
        await page.getByRole('row').getByRole('button').nth(1).click();
        const dialog2 = page.locator('div[role="dialog"]');
        await expect(dialog2).toBeVisible();
        await page.getByRole('button', { name: 'Yes, delete it!' }).click();
        //Assert
        await page.getByRole('button', { name: 'OK' }).waitFor();
        await page.getByRole('button', { name: 'OK' }).click();
    });

    test('should create a new component revision', async ({ page, pensionPage }) => {
        //Arrange
        const dialog = await pensionPage.shouldRetrieveFirstPensionBill();
        await page.getByRole('button', { name: ' Search' }).click();
        await pensionPage.okSuccess();
        //Act
        await page.getByRole('button', { name: ' Add' }).click();
        const componentNameInput = page.locator('input[formControlName="componentname"]');
        const fromDateInput = page.locator('input[placeholder="dd/mm/yyyy"]');
        const amountInput = page.locator('input[formControlName="amount"]');
        await expect(fromDateInput).toBeVisible();
        await page.click('app-popup-table');
        await page.waitForSelector('tbody tr');
        const firstRow2 = dialog.locator('tbody tr:first-child');
        const componentName = await firstRow2.locator('td:nth-child(2)').textContent();
        await firstRow2.click();
        await expect(componentNameInput).toHaveValue(componentName ?? '');
        await page.click('input[placeholder="dd/mm/yyyy"]');
        await page.click('.p-datepicker-calendar tbody tr:nth-child(1) td:nth-child(' + (Math.floor(Math.random() * 7) + 1) + ')');
        const randomAmount = (Math.floor(Math.random() * (9999 - 100 + 1)) + 100).toString();
        await amountInput.fill(randomAmount);
        await page.getByRole('button', { name: 'Submit' }).click();
        //Assert
        await pensionPage.okSuccess();
    });
