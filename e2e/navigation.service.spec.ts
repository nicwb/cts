import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('Deactivate Unused PPO Receipts', async ({
    pensionPage,
    page,
    deactivateResponse,
}) => {
    console.log(deactivateResponse);
    expect(deactivateResponse.ApiResponseStatus).toBe('Success');
    expect(deactivateResponse.Message).toBe(
        'Unused PPO receipts deactivated successfully!'
    );

    await page.goto('pension-process/ppo/entry', {
        waitUntil: 'domcontentloaded',
    });
    const addNewButton = page.getByRole('button', { name: 'Add New PPO' });
    await addNewButton.click();

    const messageLocator = page.locator(
        'text="No manual ppo receipt found!. Do you want add it?"'
    );
    await expect(messageLocator).toBeVisible();
    await page.getByRole('button', { name: 'Yes' }).click();
    expect(page.url()).toContain(
        'pension-process/ppo/ppo-receipt/new?returnUri=pension-process%2Fppo%2Fentry%2Fnew'
    );
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('button', { name: 'Yes' })).toBeVisible();
    await page.getByRole('button', { name: 'Yes' }).click();
    expect(page.url()).toContain('pension-process/ppo/entry/new');
    await page.getByRole('button', { name: 'Save' }).click();
    await pensionPage.okSuccess();
});
