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
        await this.page.goto('/static-login', { waitUntil: 'commit' });
        await this.page.getByRole('link', { name: 'cleark' }).click();
        if (this.isMobile) {
            await this.page.locator('button.layout-topbar-menu-button').click();
        }
        const dashboard = this.page.getByText('CCTSCLERK');
        await expect(dashboard).toBeVisible();
    }

    async savePpoReceipt() {
        await this.page.goto('pension-process/ppo/ppo-receipt', {
            waitUntil: 'domcontentloaded',
        });
        await this.page
            .getByRole('button', { name: 'PPO Receipt Entry' })
            .click();
        await this.page.getByRole('button', { name: 'Submit' }).click();
        await expect(
            this.page.getByRole('heading', { name: 'Success' })
        ).toBeVisible();
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async okSuccess() {
        await this.page.getByRole('heading', { name: 'Success' }).waitFor();
        await this.page.getByRole('button', { name: 'OK' }).waitFor();
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async okError() {
        await expect(
            this.page.getByRole('heading', { name: 'Aww! Snap...' })
        ).toBeVisible();
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async approvePpo(ppoId: string) {
        await this.page.goto('pension-process/approval/ppo-approval', {
            waitUntil: 'domcontentloaded',
        });
        await this.page.locator('p-button').click();
        const dialog = this.page.locator('.p-dialog');
        await expect(dialog.locator('input#float-input')).toBeVisible();
        await this.page.locator('input#float-input').fill(ppoId);
        const firstRow = dialog.locator('tbody tr:first-child');
        await expect(firstRow).toBeVisible();
        await firstRow.click();
        await this.page.getByRole('button', { name: 'Approve' }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async savePpoDetails() {
        test.slow(this.isMobile, 'PPO Entry Form takes too long to complete');
        await this.savePpoReceipt();
        await this.page.goto('pension-process/ppo/entry', {
            waitUntil: 'domcontentloaded',
        });
        const addNewButton = this.page.getByRole('button', {
            name: 'Add New PPO',
        });
        await addNewButton.click();
        await expect(async () => {
            await expect(
                this.page.locator('input[formcontrolname="pensionerAddress"]')
            ).not.toBeEmpty();
        }).toPass({ timeout: 20_000 });
        await this.page.getByRole('button', { name: 'Save' }).click();
        await this.okSuccess();
        const ppoId = await this.page
            .locator('input[formcontrolname="ppoId"]')
            .inputValue();
        return ppoId;
    }

    async savePpoDetailsAndApprove() {
        const ppoId = await this.savePpoDetails();
        await this.approvePpo(ppoId);
        return ppoId;
    }

    async savePpoDetailsApproveGenerateFirstPensionBill() {
        const ppoId = await this.savePpoDetailsAndApprove();
        await this.page.goto(
            'pension-process/pension-bill/first-pension-bill',
            { waitUntil: 'domcontentloaded' }
        );
        await this.page
            .locator('p-button')
            .getByRole('button', { name: 'Open' })
            .click();
        await this.page.getByLabel('Search data').click();
        await this.page.getByLabel('Search data').fill('' + ppoId);
        await this.page
            .getByRole('cell', { name: '' + ppoId, exact: true })
            .click();
        await this.page.getByRole('textbox', { name: 'Select a date' }).click();
        await this.page.locator('.p-datepicker-today').click();
        await expect(
            this.page.getByRole('textbox', { name: 'Select a date' })
        ).not.toBeEmpty();

        await this.page.getByRole('button', { name: 'Generate' }).click();
        await this.okSuccess();

        await this.page.getByRole('button', { name: 'Save' }).click();
        await this.okSuccess();

        return ppoId;
    }
    async savePpoDetailsApproveGenerateFirstPensionBillAndRegularPensionBill() {
        const ppoId =
            await this.savePpoDetailsApproveGenerateFirstPensionBill();
        await this.page.goto(
            'pension-process/pension-bill/regular-pension-bill',
            { waitUntil: 'domcontentloaded' }
        );
        await this.page.locator('button:has-text("Fetch Bills")').click();
        await this.okSuccess();
        await this.page.locator('#generateButton').click();
        // Assert
        await this.page.getByRole('button', { name: 'OK' }).waitFor();
        await this.page.getByRole('button', { name: 'OK' }).click();
        return ppoId;
    }

    async shouldRetrieveFirstPensionBill(): Promise<Locator> {
        const ppoId =
            await this.savePpoDetailsApproveGenerateFirstPensionBill();
        await this.goToRevisionOfComponents();
        const dialog = await this.openPopup();

        await expect(dialog.locator('label[for="float-input"]')).toHaveText(
            'Search data'
        );
        await expect(dialog.locator('input#float-input')).toBeVisible();

        await expect(dialog.locator('input#float-input')).toBeVisible();
        await this.page.locator('input#float-input').fill(ppoId);
        const firstRow = dialog.locator('tbody tr:first-child');
        await expect(firstRow).toBeVisible();
        await firstRow.click();
        return dialog;
    }

    async goToComponentRate(): Promise<void> {
        await this.page.goto('/master/component-rate', {
            waitUntil: 'domcontentloaded',
        });
        const elements = [
            {
                locator: 'h2.bg-color.text-xl >> b:has-text("Component Rate")',
                type: 'text',
            },
            { locator: 'text=Select Pension Category', type: 'text' },
            { locator: 'text=Select Component', type: 'text' },
            { locator: 'text=Date', type: 'text' },
            { locator: 'text=Rate Type P/A', type: 'text' },
            { locator: 'text=Amount/Percentage', type: 'text' },
            { locator: 'button >> text="Submit"', type: 'button' },
            { locator: 'button >> text="Refresh"', type: 'button' },
        ];
        await Promise.all(
            elements.map((element) =>
                expect(this.page.locator(element.locator)).toBeVisible()
            )
        );
        const element = this.page.locator('form button').nth(1);
        await expect(element).toBeVisible();
        const element1 = this.page.locator('form button').first();
        await expect(element1).toBeVisible();
        await expect(
            this.page.getByRole('button', { name: ' Submit' })
        ).toBeDisabled();
    }

    async goToComponentRateRevision(): Promise<void> {
        await this.page.goto('/master/component-rate-revision', {
            waitUntil: 'domcontentloaded',
        });
        const searchButton = this.page.getByRole('button', { name: 'Search' });
        await expect(searchButton).toBeVisible();
        await expect(searchButton).toBeDisabled();
        await expect(
            this.page.getByText('Pension Component Rate Details')
        ).toBeVisible();
        await expect(
            this.page.getByPlaceholder('Pension Category ID')
        ).toBeVisible();
        await expect(this.page.getByPlaceholder('Description')).toBeVisible();
        await expect(
            this.page.getByRole('button', { name: 'Refresh' })
        ).toBeVisible();
    }

    async goToRevisionOfComponents(): Promise<void> {
        await this.page.goto('pension-process/pension-details/revision', {
            waitUntil: 'domcontentloaded',
        });
        const elements = [
            {
                locator:
                    'h2.bg-color.text-xl >> b:has-text("Revision of Component")',
                type: 'text',
            },
            { locator: "text=Pensioner's Details :", type: 'text' },
            { locator: 'text=PPO ID', type: 'text' },
            { locator: 'input[placeholder="PPO ID"]', type: 'input' },
            { locator: 'app-popup-table', type: 'component' },
        ];
        //Assert
        for (const element of elements) {
            await expect(this.page.locator(element.locator)).toBeVisible();
        }
    }
    async goToSubCategory(): Promise<void> {
        await this.page.goto('/master/sub-category', {
            waitUntil: 'domcontentloaded',
        });
    }

    async goToFirstPensionBillPrint(): Promise<void> {
        await this.page.goto(
            '/pension-process/bill-print/first-pension-bill-print'
        );

        await expect(this.page.locator('text=General Bill')).toBeVisible();
        await expect(
            this.page.locator('text=Classification Bill')
        ).toBeVisible();
        await expect(this.page.locator('text=PPO Bill')).toBeVisible();
        await expect(
            this.page.locator('input[placeholder="PPO ID"]')
        ).toBeVisible();
        await expect(
            this.page.locator('input[placeholder="Pensioner Name"]')
        ).toBeVisible();
        await expect(this.page.locator('app-popup-table')).toBeVisible();
        await expect(
            this.page.locator('button >> text="Generate Report"')
        ).toBeVisible();
        await expect(
            this.page.locator('button >> text="Refresh"')
        ).toBeVisible();
        await expect(
            this.page.locator('button:has-text("Generate Report")')
        ).toBeDisabled();
    }

    async goToPensionCategory(): Promise<void> {
        await this.page.goto('/master/pension-category');
        await this.page.getByRole('button', { name: 'New' }).click();
        await expect(
            this.page
                .locator('div')
                .filter({ hasText: /^Pension Category Details$/ })
        ).toBeVisible();
        await expect(
            this.page.getByRole('button', { name: 'New Primary' })
        ).toBeVisible();
        await this.page.getByRole('button', { name: 'New Primary' }).click();

        const element1 = this.page.locator('app-popup-table');
        await expect(element1).toBeVisible();
        await element1.click();
        const dialog = this.page.getByLabel('Search', { exact: true });
        await expect(dialog).toBeVisible();
        const firstRow = dialog.locator('tbody tr:first-child');
        await this.page.waitForSelector('tbody tr:first-child', {
            timeout: 500,
        });
        await firstRow.click();

        await expect(
            this.page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await this.page.getByRole('button', { name: 'Submit' }).click();
        await this.okSuccess();

        await expect(
            this.page.getByRole('button', { name: 'New Sub' })
        ).toBeVisible();
        await this.page.getByRole('button', { name: 'New Sub' }).click();

        await expect(
            this.page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await this.page.getByRole('button', { name: 'Submit' }).click();
        await this.okSuccess();

        await expect(
            this.page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await this.page.getByRole('button', { name: 'Submit' }).click();
        await this.okSuccess();
    }

    async goToRegularPensionBillPrint(): Promise<void> {
        await this.page.goto(
            '/pension-process/bill-print/regular-pension-bill-print'
        );
        await expect(
            this.page.getByText('Month', { exact: false }).nth(1)
        ).toBeVisible();
        await expect(this.page.getByText('Year:')).toBeVisible();
    }

    async goToPrimaryComponent(): Promise<void> {
        await this.page.goto('/master/primary');
        await expect(
            this.page.getByRole('button', { name: 'New' })
        ).toBeVisible();
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

    async verifyFormFieldIsVisible(fieldName: string) {
        const locator = this.page.locator(
            `input[formControlName="${fieldName}"]`
        );
        await expect(locator).toBeVisible();
    }

    async selectFirstComponent(): Promise<string> {
        const element1 = this.page.locator('form button').first();
        await expect(element1).toBeVisible();
        await element1.click();

        const dialog = this.page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();

        // Get all available rows in the dialog
        const rows = dialog.locator('tbody tr');
        const rowCount = await rows.count();

        // Ensure there are rows available to select
        if (rowCount === 0) {
            console.log('No available components to select.');
        }

        // Generate a random index to select a row, skipping the first 4 rows
        const randomIndex = Math.floor(Math.random() * (rowCount - 3)) + 3;
        const randomRow = rows.nth(randomIndex);

        // Click on the randomly selected row
        const firstColumn = randomRow.locator('td:first-child');
        const firstColumnText = await firstColumn.textContent();
        await randomRow.click();
        if (firstColumnText === null) {
            throw new Error('Failed to retrieve text content');
        }
        return firstColumnText;
    }
    async selectFirstPensionCategory(): Promise<string> {
        const element = this.page.locator('form button').nth(1);
        await expect(element).toBeVisible();
        await element.click();

        const dialog = this.page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();

        // Wait for rows to be stable
        const rows = dialog.locator('tbody tr');
        await rows.first().waitFor({ state: 'visible' }); // Ensure at least one row is visible

        const rowCount = await rows.count();
        if (rowCount === 0) {
            console.log('No available pension categories to select.');
        }

        // Generate a random index to select a row
        const randomIndex = Math.floor(Math.random() * rowCount);
        const randomRow = rows.nth(randomIndex);

        // Ensure the selected row is stable
        await randomRow.waitFor({ state: 'visible' });
        const firstColumn = randomRow.locator('td:first-child');
        const firstColumnText = await firstColumn.textContent();
        await randomRow.click();
        if (firstColumnText === null) {
            throw new Error('Failed to retrieve text content');
        }
        return firstColumnText;
    }

    async fillComponentRateForm({
        rateType,
        rateAmount,
    }: {
        rateType: string;
        rateAmount: number;
    }): Promise<void> {
        const cal = this.page.locator(
            'p-calendar[formControlName="effectiveFromDate"]'
        );
        await expect(cal).toBeVisible();
        await cal.click();

        // Wait for the datepicker to be visible
        await this.page.waitForSelector('.p-datepicker-calendar', {
            state: 'visible',
        });

        // Generate a random date between 7 and 24
        const randomDate = Math.floor(Math.random() * (24 - 7 + 1)) + 7;
        console.log(`Randomly selected date: ${randomDate}`);

        // Use getByText to select the date
        const selectedDate = this.page.getByText(randomDate.toString(), {
            exact: true,
        });

        // Ensure that the selected date is visible and click it
        await expect(selectedDate).toBeVisible();
        await selectedDate.click();
        console.log(`Clicked on date: ${randomDate}`);

        // Continue with filling the form
        const rate = this.page.locator(
            'p-dropdown[formControlName="rateType"]'
        );
        await expect(rate).toBeVisible();
        await rate.click();
        await this.page.locator(`.p-dropdown-item >> text=${rateType}`).click();
        await this.page.fill(
            'input[formControlName="rateAmount"]',
            rateAmount.toString()
        );
    }

    async verifyComponentRateFormFields(): Promise<void> {
        await expect(
            this.page.locator('input[formControlName="categoryName"]')
        ).toBeVisible();
        await expect(
            this.page.locator('input[formControlName="componentName"]')
        ).toBeVisible();
        await expect(
            this.page.locator('p-calendar[formControlName="effectiveFromDate"]')
        ).toBeVisible();
        await expect(
            this.page.locator('p-dropdown[formControlName="rateType"]')
        ).toBeVisible();
        await expect(
            this.page.locator('input[formControlName="rateAmount"]')
        ).toBeVisible();
        await expect(
            this.page.getByRole('button', { name: ' Submit' })
        ).toBeEnabled();
    }

    async resetForm(formControlNames: string[]): Promise<void> {
        await this.page.getByRole('button', { name: 'Refresh' }).click();
        for (const formControlName of formControlNames) {
            await expect(
                this.page.locator(`input[formControlName="${formControlName}"]`)
            ).toHaveValue('');
        }
    }

    async verifyFormIsReset(formControlNames: string[]): Promise<void> {
        for (const formControlName of formControlNames) {
            await expect(
                this.page.locator(`input[formControlName="${formControlName}"]`)
            ).toHaveValue('');
        }
        await expect(
            this.page.getByRole('button', { name: 'Submit' })
        ).toBeDisabled();
    }
}
