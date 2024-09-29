import { test, expect } from "./fixtures";

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test("Navigation Service", async ({ pensionPage,page }) => {
    //Arrange
    const ppoId = await pensionPage.savePpoDetailsWithoutBankAccount();

    //Act
    await pensionPage.page.goto('/#/pension/modules/pension-process/approval/ppo-approval', { waitUntil: "domcontentloaded"});
    await pensionPage.page.getByLabel('PPO ApprovalPPO ID:').getByRole('button').click();
    await pensionPage.page.getByRole('cell', { name: ppoId, exact: true }).click();
    await page.getByRole('button', { name: 'Update Bank Account Details' }).click();

    //Assert
    await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/entry/${ppoId}/bank-account?return-uri=%2Fpension%2Fmodules%2Fpension-process%2Fapproval%2Fppo-approval%2F${ppoId}&ask=Do%20you%20want%20go%20back%20to%20approval%20form%3F`);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByLabel('Confirmation')).toBeVisible();
    await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page).toHaveURL(`/#/pension/modules/pension-process/approval/ppo-approval/${ppoId}`);
    await page.getByRole('button', { name: 'Approve' }).click();
    await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
});