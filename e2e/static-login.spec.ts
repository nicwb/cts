import { test, expect } from '@playwright/test';

import { DotEnv } from "utils/env"

test.describe('Static Login', () =>{

    test.beforeEach(async ({ page }) => {
        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login', { waitUntil: "commit" });
    });

    test('should display the "Static Login" page', async ({ page }) => {
        // Navigate to the page containing your component
        const staticLoginPage = page.locator(`span:has-text("${DotEnv.NG_APP_API_BASE_URL}")`);
        await expect(staticLoginPage).toBeVisible();
    });

    [
        { role: 'cleark', displayName: 'CLERK' },
        { role: 'dealing-assistant', displayName: 'DEALLING-ASSISTANT' },
        { role: 'accountant', displayName: 'ACCOUNTANT' },
        { role: 'treasury-officer', displayName: 'TREASURY-OFFICER' },
        { role: 'DTA', displayName: 'DTA' },
        { role: 'CHEQUE-OPERATOR', displayName: 'CHEQUE-OPERATOR' },

    ].forEach(({ role, displayName }) => {
        test(`${displayName} can login`,
            async ({page, isMobile}) => {
                await page.getByRole('link', { name: `${role}` }).click();
                if(isMobile) {
                    page.locator('button.layout-topbar-menu-button').click()
                }
                const dashboard = page.getByText(`CCTS${displayName}`);
                await expect(dashboard).toBeVisible();
            }
        );
    });

});


// https://sadaniruchee.medium.com/playwright-executing-automation-scripts-in-multiple-environments-using-dotenv-package-800d643c6c73
