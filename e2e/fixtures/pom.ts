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
    await this.page.goto('/static-login', { waitUntil: "commit" });
    await this.page.getByRole('link', { name: 'cleark' }).click();
    if (this.isMobile) {
      await this.page.locator('button.layout-topbar-menu-button').click();
    }
    const dashboard = this.page.getByText('CCTSCLERK');
    await expect(dashboard).toBeVisible();
  }

  async savePpoReceipt() {
    await this.page.goto('pension-process/ppo/ppo-receipt', { waitUntil: "domcontentloaded" });
    await this.page.getByRole('button', { name: 'PPO Receipt Entry' }).click();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async okSuccess() {
    await this.page.getByRole('heading', { name: 'Success' }).waitFor();
    await this.page.getByRole('button', { name: 'OK' }).waitFor();
    await this.page.getByRole('button', { name: 'OK' }).click();
}

  async okError() {
    await expect(this.page.getByRole('heading', { name: 'Aww! Snap...' })).toBeVisible();
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async approvePpo(ppoId: string) {
    await this.page.goto('pension-process/approval/ppo-approval', { waitUntil: "domcontentloaded" });
    await this.page.getByLabel('PPO ApprovalPPO ID:').getByRole('button').click();
    const totalPages = await this.page.locator('.p-paginator-pages .p-paginator-page').count();
    for (let i = 1; i <= totalPages; i++) {
      await this.page.locator('.p-paginator-pages .p-paginator-page:nth-child(' + i + ')').click();
      const cell = this.page.getByRole('cell', { name: ppoId, exact: true });
      if (await cell.isVisible()) {
        await cell.click();
        break;
      }
    }
    await this.page.getByRole('button', { name: 'Approve' }).click();
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async savePpoDetails() {
    test.slow(this.isMobile, 'PPO Entry Form takes too long to complete');
    await this.savePpoReceipt();
    await this.page.goto('pension-process/ppo/entry', { waitUntil: "domcontentloaded" });
    const addNewButton = this.page.getByRole('button', { name: 'Add New PPO' });
    await addNewButton.click();
    await expect(async () => {
      await expect(this.page.locator('input[formcontrolname="pensionerAddress"]')).not.toBeEmpty();
    }).toPass({ timeout: 20_000 });
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.okSuccess();
    const ppoId = await this.page.locator('input[formcontrolname="ppoId"]').inputValue();
    return ppoId;
  }

  async savePpoDetailsAndApprove() {
    const ppoId = await this.savePpoDetails();
    await this.approvePpo(ppoId);
    return ppoId;
  }

  async savePpoDetailsApproveGenerateFirstPensionBill() {
    const ppoId = await this.savePpoDetailsAndApprove();
      await this.page.goto('pension-process/pension-bill/first-pension-bill', { waitUntil: "domcontentloaded"});
        await this.page.locator('p-button').getByRole('button', {name: "Open"}).click();
        await this.page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
        await this.page.getByRole('textbox', { name: 'Select a date' }).click();
        await this.page.locator('.p-datepicker-today').click();
        await expect(this.page.getByRole('textbox', { name: 'Select a date' })).not.toBeEmpty();

        await this.page.getByRole('button', { name: 'Generate' }).click();
        await expect(this.page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await this.page.getByRole('button', { name: 'OK' }).click();

        await this.page.getByRole('button', { name: 'Save' }).click();
        await expect(this.page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await this.page.getByRole('button', { name: 'OK' }).click();

        // Assert
        await expect(this.page.getByText('Component Detail:Component')).toBeVisible();
        await expect(this.page.getByText('Bill Details:Bill')).toBeVisible();
        await expect(this.page.getByText('Pension Details:PPO')).toBeVisible();
        return ppoId;
  }

  async shouldRetrieveFirstPensionBill(): Promise<Locator> {
    const ppoId = await this.savePpoDetailsApproveGenerateFirstPensionBill()
    await this.goToRevisionOfComponents();
    const dialog = await this.openPopup();

    await expect(dialog.locator('label[for="float-input"]')).toHaveText('Search data');
    await expect(dialog.locator('input#float-input')).toBeVisible();

    const totalPages = await this.page.locator('.p-paginator-pages .p-paginator-page').count();
    for (let i = 1; i <= totalPages; i++) {
      await this.page.locator('.p-paginator-pages .p-paginator-page:nth-child(' + i + ')').click();
      const cell = this.page.getByRole('cell', { name: ppoId, exact: true });
      if (await cell.isVisible()) {
        await cell.click();
        break;
      }
    }
    return dialog;
  }

  async goToComponentRate(): Promise<void> {
    await this.page.goto('/master/component-rate', { waitUntil: 'domcontentloaded' });
    const elements = [
      { locator: 'h2.bg-color.text-xl >> b:has-text("Component Rate")', type: 'text' },
      { locator: 'text=Select Pension Category', type: 'text' },
      { locator: 'text=Select Component', type: 'text' },
      { locator: 'text=Date', type: 'text' },
      { locator: 'text=Rate Type P/A', type: 'text' },
      { locator: 'text=Amount/Percentage', type: 'text' },
      { locator: 'button >> text="Submit"', type: 'button' },
      { locator: 'button >> text="Refresh"', type: 'button' }
  ];
      await Promise.all(elements.map(element =>
          expect(this.page.locator(element.locator)).toBeVisible()
      ));
      const element = this.page.locator('form button').nth(1);
      await expect(element).toBeVisible();
      const element1 = this.page.locator('form button').first();
      await expect(element1).toBeVisible();
      await expect(this.page.getByRole('button', { name: ' Submit' })).toBeDisabled();
  }

  async goToComponentRateRevision(): Promise<void> {
    await this.page.goto('/master/component-rate-revision', { waitUntil: 'domcontentloaded' });
    const elements = [
      this.page.getByText('Pension Component Rate Details'),
      this.page.getByPlaceholder('Pension Category ID'),
      this.page.getByPlaceholder('Description'),
      this.page.getByRole('button', { name: 'Search' }),
      this.page.getByRole('button', { name: 'Refresh' }),
    ];
    for (const element of elements) {
      await expect(element).toBeVisible();
    }
    await expect(this.page.getByRole('button', { name: 'Search' })).toBeDisabled();
  }

  async goToComponent():Promise<void> {
    await this.page.goto('/master/component', { waitUntil: 'domcontentloaded' });
  }

  async goToRevisionOfComponents():Promise<void> {
    await this.page.goto('pension-process/pension-details/revision', { waitUntil: "domcontentloaded"});
    const elements = [
        { locator: 'h2.bg-color.text-xl >> b:has-text("Revision of Component")', type: 'text' },
        { locator: 'text=Pensioner\'s Details :', type: 'text' },
        { locator: 'text=PPO ID', type: 'text' },
        { locator: 'input[placeholder="PPO ID"]', type: 'input' },
        { locator: 'app-popup-table', type: 'component' },
        { locator: 'text=PPO Number', type: 'text' },
        { locator: 'text=Pensioner Name', type: 'text' },
        { locator: 'text=Category Description', type: 'text' },
        { locator: 'text=Bank', type: 'text' },
    ];
    //Assert
    for (const element of elements) {
        await expect(this.page.locator(element.locator)).toBeVisible();
    }
  }
  async goToSubCategory():Promise<void> {
    await this.page.goto('/master/sub-category', { waitUntil: 'domcontentloaded' });
  }

  async goToFirstPensionBillPrint():Promise<void> {
    await this.page.goto('/pension-process/bill-print/first-pension-bill-print');
    const elements = [
      { locator: 'text=General Bill', type: 'text' },
      { locator: 'text=Classification Bill', type: 'text' },
      { locator: 'text=PPO Bill', type: 'text' },
      { locator: 'input[placeholder="PPO ID"]', type: 'input' },
      { locator: 'input[placeholder="Pensioner Name"]', type: 'input' },
      { locator: 'app-popup-table', type: 'component' },
      { locator: 'button >> text="Generate Report"', type: 'button' },
      { locator: 'button >> text="Refresh"', type: 'button' }
      ];

      for (const element of elements) {
          await expect(this.page.locator(element.locator)).toBeVisible();
      }
      await expect(this.page.locator('button:has-text("Generate Report")')).toBeDisabled();
  }

  async goToPensionCategory():Promise<void> {
    await this.page.goto('/master/pension-category');
    await this.page.getByRole('button', { name: 'New' }).click();
    await expect(this.page.locator('div').filter({ hasText: /^Pension Category Details$/ })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'New Primary' })).toBeVisible();
    await this.page.getByRole('button', { name: 'New Primary' }).click();
    await expect(this.page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('button', { name: 'OK' }).click();
    await expect(this.page.getByRole('button', { name: 'New Sub' })).toBeVisible();
    await this.page.getByRole('button', { name: 'New Sub' }).click();
    await expect(this.page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('button', { name: 'OK' }).click();
    await expect(this.page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.page.getByLabel('Success')).toContainText('Pension Category Details added successfully');
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async goToRegularPensionBillPrint():Promise<void> {
    await this.page.goto('/pension-process/bill-print/regular-pension-bill-print');
    await expect(this.page.getByText('Month')).toBeVisible();
    await expect(this.page.getByText('Year:')).toBeVisible();
  }

  async goToPrimaryComponent():Promise<void> {
    await this.page.goto('/master/primary');
    await expect(this.page.getByRole('button', { name: 'New' })).toBeVisible();
  }
  async openPopup() {
    await this.page.click('app-popup-table');
    const dialog = this.page.locator('.p-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('input#float-input')).toBeVisible();
    await expect(dialog.locator('p-table')).toBeVisible();
    return dialog;
  }

  async openPopupAndSelectFirstRow() {
    const dialog = await this.openPopup();
    const firstRow = dialog.locator('tbody tr:first-child');
    await expect(firstRow).toBeVisible();

    await firstRow.click();
    return firstRow;
  }
  async verifyComponentRateTableHeaders(expectedHeaders: string[]): Promise<void> {
    const table = this.page.locator('p-table');
    await expect(table).toBeVisible();
    await Promise.all(expectedHeaders.map(header =>
      expect(table.locator(`th:has-text("${header}")`)).toBeVisible()
    ));
  }
  async verifyTableHeaders(headers: string[], tableLocator: Locator) {
    for (const header of headers) {
      await expect(tableLocator.locator('th').filter({ hasText: header }).first()).toBeVisible();
    }
  }


  async verifyFormField(fieldName: string) {
    const locator = this.page.locator(`input[formControlName="${fieldName}"]`);
    await expect(locator).toBeVisible();
  }

  async verifyPaginationButtons(): Promise<void> {
    const nextButton = this.page.locator('.p-paginator-next');
    const prevButton = this.page.locator('.p-paginator-prev');
    await expect(nextButton).toBeDisabled();
    await expect(prevButton).toBeDisabled();
  }

  async selectFirstComponent(): Promise<void> {
    const element1 = this.page.locator('form button').first();
    await expect(element1).toBeVisible();
    await element1.click();
    const dialog = this.page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    const firstRow = dialog.locator('tbody tr:first-child');
    await this.page.waitForSelector('tbody tr:first-child', { timeout: 500 });
    await firstRow.click();
  }

  async selectFirstPensionCategory(): Promise<void> {
    const element = this.page.locator('form button').nth(1);
    await expect(element).toBeVisible();
    await element.click();
    const dialog = this.page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    const firstRow = dialog.locator('tbody tr:first-child');
    await this.page.waitForSelector('tbody tr:first-child', { timeout: 500 });
    await firstRow.click();
  }

  async fillComponentRateForm({ useCurrentDate, day, daysFromNow, rateType, rateAmount }: {
    useCurrentDate?: boolean;
    day?: string;
    daysFromNow?: number;
    rateType: string;
    rateAmount: number;
  }): Promise<void> {
    const cal = this.page.locator('p-calendar[formControlName="effectiveFromDate"]');
    await expect(cal).toBeVisible();
    await cal.click();

    if (useCurrentDate) {
      await this.page.locator('.p-datepicker-today').click();
    } else if (day) {
      await this.page
        .locator(`.p-datepicker-calendar td:not(.p-disabled)`)
        .locator(`text="${day}"`)
        .first()
        .click();
    } else if (daysFromNow) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysFromNow);
      const futureDay = futureDate.getDate();
      await this.page
        .locator(`.p-datepicker-calendar td:not(.p-disabled)`)
        .locator(`text="${futureDay}"`)
        .first()
        .click();
    }

    const rate = this.page.locator('p-dropdown[formControlName="rateType"]');
    await expect(rate).toBeVisible();
    await rate.click();
    await this.page.locator(`.p-dropdown-item >> text=${rateType}`).click();

    await this.page.fill('input[formControlName="rateAmount"]', rateAmount.toString());
  }

  async verifyComponentRateFormFields(): Promise<void> {
    await expect(this.page.locator('input[formControlName="categoryName"]')).toBeVisible();
    await expect(this.page.locator('input[formControlName="componentName"]')).toBeVisible();
    await expect(this.page.locator('p-calendar[formControlName="effectiveFromDate"]')).toBeVisible();
    await expect(this.page.locator('p-dropdown[formControlName="rateType"]')).toBeVisible();
    await expect(this.page.locator('input[formControlName="rateAmount"]')).toBeVisible();
    await expect(this.page.getByRole('button', { name: ' Submit' })).toBeEnabled();
  }

  async resetForm(formControlNames: string[]): Promise<void> {
    await this.page.getByRole('button', { name: 'Refresh' }).click();
    for (const formControlName of formControlNames) {
      await expect(this.page.locator(`input[formControlName="${formControlName}"]`)).toHaveValue('');
    }
  }

  async verifyFormIsReset(formControlNames: string[]): Promise<void> {
    for (const formControlName of formControlNames) {
      await expect(this.page.locator(`input[formControlName="${formControlName}"]`)).toHaveValue('');
    }
    await expect(this.page.getByRole('button', { name: 'Submit' })).toBeDisabled();
  }

  async submitComponentRateForm(): Promise<void> {
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async verifyComponentRateTableData(): Promise<void> {
    const table = this.page.locator('p-table');
    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    const firstRowText = await rows.first().textContent();


    expect(rowCount).toBeGreaterThan(0);
    expect(firstRowText).toBeTruthy();


    if (!firstRowText?.includes('No records found')) {
      for (let i = 0; i < 6; i++) {  // 6 columns as per headers
        const cell = table.locator(`td:nth-child(${i + 1})`).first();
        await expect(cell).toBeVisible();
        const cellText = await cell.textContent();
        expect(cellText).toBeTruthy();
      }
    }
  }


}
