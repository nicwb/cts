import { test, expect } from "./fixtures";

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    //NEEDS FIX
});

test("Navigation Service", async ({ pensionPage, page }) => {
    await page.goto('pension-process/ppo/entry', { waitUntil: "domcontentloaded" });
    const addNewButton = page.getByRole('button', { name: 'Add New PPO' });
    await addNewButton.click();

    const messageLocator = page.locator('text="No manual ppo receipt found!. Do you want add it?"');
    const isMessageVisible = await messageLocator.isVisible({ timeout: 3000 })
        .catch(() => false);

    if (isMessageVisible) {
        await page.getByText('Yes').click();
        expect(page.url()).toContain('pension-process/ppo/ppo-receipt/new?returnUri=pension-process%2Fppo%2Fentry%2Fnew');
        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('button', { name: 'Yes' })).toBeVisible();
        await page.getByRole('button', { name: 'Yes' }).click();
        expect(page.url()).toContain('pension-process/ppo/entry/new');
    } else {
        await page.getByRole('button', { name: 'Save' }).click();
        await pensionPage.okSuccess();
    }
});