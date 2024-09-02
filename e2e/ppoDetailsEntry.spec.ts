import { test, expect } from '@playwright/test';
test.describe('PPODetails Entry', () => {
  test.beforeEach(async ({ page, isMobile }) => {
      test.fixme(isMobile, "Complete task-144 before runnign this test");
      // Navigate to the static login page containing user roles
      await page.goto('/#/static-login');
      await page.getByRole('link', { name: 'cleark' }).click();
      const dashboard = page.getByText('CCTSCLERK');
      await expect(dashboard).toBeVisible();
      await page.goto('/#/pension/modules/pension-process/ppo/entry/ppodetails');
  });

  test("Entry a Details", async ({ page }) => {
    await page.getByRole('button', { name: 'Add New PPO' }).click();
    await page.locator('span').filter({ hasText: 'e-PPO Application No/TRID' }).getByRole('button').click();
    await page.waitForTimeout(500);
    await page.getByRole('row').nth(1).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('alert')).toContainText('PPO Details saved sucessfully!');
  });
  
});