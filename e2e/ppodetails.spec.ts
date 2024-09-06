import { test, expect } from '@playwright/test';

test.describe('PPODetails Entry', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        // test.fixme(isMobile, "Need to make ppodetails entry mobile friendly before runnign this test");

        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        
        if(isMobile) {
            page.locator('button.layout-topbar-menu-button').click();
        }
        const dashboard = page.getByText('CCTSCLERK');
        await expect(dashboard).toBeVisible();
    });
    
    test("Save PPO details", async ({ page }) => {
        //Arrange
        await page.goto('/#/pension/modules/pension-process/ppo/manualPpoReceipt');
        await page.getByRole('button', { name: 'New Manual PPO Entry' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        
        
        //Act
        await page.goto('/#/pension/modules/pension-process/ppo/entry/ppodetails');
        await page.getByRole('button', { name: 'Add New PPO' }).click();
        const nameLocator = page.locator('#pensionerName');
        await expect(nameLocator).not.toBeEmpty();
        await page.locator('span').filter({ hasText: 'e-PPO Application No/TRID' }).getByRole('button').click();
        await page.locator('td.ng-star-inserted').first().click();
        await page.getByLabel('PPO DetailsPPO No.Pensioner').locator('app-popup-table').getByRole('button').click();
        await page.locator('td.ng-star-inserted').first().click();
        await page.getByRole('button', { name: 'Save' }).click();
        
        //Assert
        await expect(page.getByLabel('Success').first()).toBeVisible();
        
    });
});