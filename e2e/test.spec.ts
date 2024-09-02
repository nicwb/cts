import { test, expect } from '@playwright/test';

test.describe('Manual PPO Receipt Component', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        test.fixme(isMobile, "Complete task-144 before running this test");
        
        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        const dashboard = page.getByText('CCTSCLERK');
        await expect(dashboard).toBeVisible();
    

        // Navigate to the page containing your component
        await page.goto('/#/pension/modules/pension-process/ppo/manualPpoReceipt');
    });

    test("PPO ENTRY CIN", async ({ page }) => {
        // Your test code here
    });
});
