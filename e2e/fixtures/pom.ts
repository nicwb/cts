import { expect, type Locator, type Page } from '@playwright/test';
import { test } from '.';

export class PensionModule {
  readonly page: Page;
  readonly successMessage: Locator;

  readonly isMobile: boolean;

  constructor(page: Page, isMobile: boolean) {
    this.page = page;
    this.successMessage = page.getByRole('heading', { name: 'Success' });
    this.isMobile = isMobile;
  }

  async staticLogin() {
    await this.page.goto('/static-login', { waitUntil: "commit"});
    await this.page.getByRole('link', { name: 'cleark' }).click();
    if (this.isMobile) {
      await this.page.locator('button.layout-topbar-menu-button').click()
    }
    const dashboard = this.page.getByText(`CCTSCLERK`);
    await expect(dashboard).toBeVisible();
  }

  async savePpoReceipt() {
    await this.page.goto('/pension/modules/pension-process/ppo/receipt', { waitUntil: "domcontentloaded"});
    await this.page.getByRole('button', { name: 'New Manual PPO Entry' }).click();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async okSuccess() {
    await expect(this.page.getByRole('heading', { name: 'Success' })).toBeVisible();
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async okError() {
    await expect(this.page.getByRole('heading', { name: 'Aww! Snap...' })).toBeVisible();
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async approvePpo(ppoId : string) {
    await this.page.goto('/pension/modules/pension-process/approval/ppo-approval', { waitUntil: "domcontentloaded"});
    await this.page.getByLabel('PPO ApprovalPPO ID:').getByRole('button').click();
    await this.page.getByRole('cell', { name: ppoId, exact: true }).click();
    await this.page.getByRole('button', { name: 'Approve' }).click();
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async savePpoDetailsWithoutBankAccount() {
    test.fixme(true, 'Remove this line after fixing PPO Entry Form');
    test.slow(this.isMobile, 'PPO Entry Form takes too long to complete');
    await this.savePpoReceipt();
    await this.page.goto('/pension/modules/pension-process/ppo/entry', { waitUntil: "domcontentloaded"});
    const addNewButton = this.page.getByRole('button', { name: 'Add New PPO' });
    await addNewButton.click();
    await expect(async () => {
        await expect(this.page.locator('div').filter({ hasText: /^Address:$/ }).getByRole('textbox')).not.toBeEmpty();
    }).toPass({
        // intervals: [2_00, 5_00, 8_00],
        timeout: 20_000
    });
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.getByRole('button', { name: 'OK' }).click();
    const ppoId = await this.page.locator('input[formcontrolname="ppoId"]').inputValue();
    return ppoId;
  }

  async savePpoDetails() {
    const ppoId = await this.savePpoDetailsWithoutBankAccount();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await expect(this.page.getByLabel('Account No', { exact: true })).not.toBeEmpty();
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.getByRole('button', { name: 'OK' }).click();
    return ppoId;
  }

  async savePpoDetailsAndApprove() {
    const ppoId = await this.savePpoDetails();
    await this.approvePpo(ppoId);
    return ppoId;
  }

}
