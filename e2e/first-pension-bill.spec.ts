import { test, expect } from "@playwright/test";

test.describe('First pension bill', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login', { waitUntil: "commit"});
        await page.getByRole('link', { name: 'cleark' }).click();
        if (isMobile) {
            page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        // Navigate to the page containing your component
        // await page.goto('/#/pension/modules/pension-process/pension-bill', { waitUntil: "domcontentloaded"});
    });

    test('can generate first pension bill and save', async ({ page }) => {
        // Arrange
        // -- | Add New PPO with Bank Account
        await page.goto('/#/pension/modules/pension-process/ppo/manualPpoReceipt', { waitUntil: "domcontentloaded"});
        await page.getByRole('button', { name: 'New Manual PPO Entry' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.getByRole('button', { name: 'OK' }).click();
        await page.goto('/#/pension/modules/pension-process/ppo/entry', { waitUntil: "domcontentloaded"});
        const addNewButton = page.getByRole('button', { name: 'Add New PPO' });
        await addNewButton.click();
        await expect(page.locator('div').filter({ hasText: /^Address:$/ }).getByRole('textbox')).not.toBeEmpty();
        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByRole('button', { name: 'OK' }).click();
        const ppoId = await page.locator('input[formcontrolname="ppoId"]').inputValue();
        await page.getByRole('button', { name: 'Next' }).click();
        await expect(page.getByLabel('Account No', { exact: true })).not.toBeEmpty();
        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByRole('button', { name: 'OK' }).click();
        
        // -- | Approve PPO
        await page.goto('/#/pension/modules/pension-process/approval/ppo-approval', { waitUntil: "domcontentloaded"});
        await page.getByLabel('PPO ApprovalPPO ID:').getByRole('button').click();
        await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        await page.getByRole('button', { name: 'Approve' }).click();
        await page.getByRole('button', { name: 'OK' }).click();

        // Act
        // -- | Generate first pension bill
        await page.goto('/#/pension/modules/pension-process/pension-bill', { waitUntil: "domcontentloaded"});
        await page.locator('p-button').getByRole('button', {name: "Search"}).click();
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
    });
});