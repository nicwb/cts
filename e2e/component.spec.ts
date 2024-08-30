import {test,expect} from "@playwright/test";

test.describe('Pension Component Module', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        test.fixme(isMobile, "Complete task-144 before runnign this test");
        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        const dashboard = page.getByText('CCTSCLERK');
        await expect(dashboard).toBeVisible();
        // Navigate to the page containing your component
        await page.goto('/#/master/app-pension/component');
      });
    

    test('Check the "New Entry" button is visible or not', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'New Entry' })).toBeVisible();
    })
    
    test('Check the input box is visible or not and submit successfully', async ({ page }) => {
        let text = Math.floor(Math.random() * 1000 - 999 + 1) + 999;
        await page.getByRole('button', { name: 'New Entry' }).click();
        await expect(page.getByPlaceholder('Description ')).toBeVisible();
        await page.getByPlaceholder('Description ').fill(`TEST ${text}`);
        await expect(page.getByLabel('Pension Components Details').getByLabel('dropdown trigger')).toBeVisible();
        await page.getByLabel('Pension Components Details').getByLabel('dropdown trigger').click();
        let num = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
        if(num==0){
            await expect(page.getByLabel('Payment')).toBeVisible();
            await page.getByLabel('Payment').click();
        }else{
            await expect(page.getByLabel('Deduction')).toBeVisible();
            await page.getByLabel('Deduction').click();
        }
        await expect(page.getByRole('checkbox', { name: 'No' })).toBeVisible();
        if(num==1){
            await page.getByRole('checkbox', { name: 'No' }).click();
        }
        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText("Component Details added successfully");
    })

    test('Duplicate data Checking', async ({ page }) => {
        let text = Math.floor(Math.random() * 1000 - 999 + 1) + 999;
        await page.getByRole('button', { name: 'New Entry' }).click();
        await expect(page.getByPlaceholder('Description ')).toBeVisible();
        await page.getByPlaceholder('Description ').fill(`TEST ${text}`);
        await expect(page.getByLabel('Pension Components Details').getByLabel('dropdown trigger')).toBeVisible();
        await page.getByLabel('Pension Components Details').getByLabel('dropdown trigger').click();
        let num = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
        if(num==0){
            await expect(page.getByLabel('Payment')).toBeVisible();
            await page.getByLabel('Payment').click();
        }else{
            await expect(page.getByLabel('Deduction')).toBeVisible();
            await page.getByLabel('Deduction').click();
        }
        await expect(page.getByRole('checkbox', { name: 'No' })).toBeVisible();
        if(num==1){
            await page.getByRole('checkbox', { name: 'No' }).click();
        }
        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText("Component Details added successfully");

        await page.getByRole('button', { name: 'New Entry' }).click();
        await expect(page.getByPlaceholder('Description ')).toBeVisible();
        await page.getByPlaceholder('Description ').fill(`TEST ${text}`);
        await expect(page.getByLabel('Pension Components Details').getByLabel('dropdown trigger')).toBeVisible();
        await page.getByLabel('Pension Components Details').getByLabel('dropdown trigger').click();
        if(num==0){
            await expect(page.getByLabel('Payment')).toBeVisible();
            await page.getByLabel('Payment').click();
        }else{
            await expect(page.getByLabel('Deduction')).toBeVisible();
            await page.getByLabel('Deduction').click();
        }
        await expect(page.getByRole('checkbox', { name: 'No' })).toBeVisible();
        if(num==1){
            await page.getByRole('checkbox', { name: 'No' }).click();
        }
        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText("already exists");
    })
    
    test('Check the cancel button is visible and working successfully', async ({ page }) => {
        await page.getByRole('button', { name: 'New Entry' }).click();
        await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page.getByText('Pension Components Details')).toBeHidden();
    })
})
