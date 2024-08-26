import { test, expect, request } from '@playwright/test';

import { DotEnv } from "utils/env"

test.describe('Pension Module Test', () =>{

  test.beforeEach(async ({ page }) => {
    // Navigate to the static login page containing user roles
    await page.goto('/#/static-login');
  });
  
  test('should display the "Static Login" page', async ({ page }) => {
    // Navigate to the page containing your component
    const staticLoginPage = page.locator(`span:has-text("${DotEnv.NG_APP_API_BASE_URL}")`);
    await expect(staticLoginPage).toBeVisible();
  });
});


// https://sadaniruchee.medium.com/playwright-executing-automation-scripts-in-multiple-environments-using-dotenv-package-800d643c6c73