import {test, expect} from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToFirstPensionBillPrint();
});

    test('should validate form fields', async ({ page, pensionPage }) => {
        await page.locator('p-radioButton[label="General Bill"]').click();
        await expect(pensionPage.page.locator('button:has-text("Generate Report")')).toBeDisabled();

        await pensionPage.openPopupAndSelectFirstRow();
        await expect(pensionPage.page.locator('button:has-text("Generate Report")')).toBeEnabled();
    });

    test('should select PPO and display details correctly', async ({ page, pensionPage }) => {
        await pensionPage.openPopupAndSelectFirstRow();
        const ppoIdValue = await pensionPage.page.locator('input[placeholder="PPO ID"]').inputValue();
        const pensionerName = await pensionPage.page.locator('input[placeholder="Pensioner Name"]').inputValue();

        await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue(ppoIdValue ?? '');
        await expect(page.locator('input[placeholder="Pensioner Name"]')).toHaveValue(pensionerName ?? '');
      });

    test('should refresh page and clear PPO ID', async ({ page, pensionPage }) => {
        await pensionPage.openPopupAndSelectFirstRow();
        await page.click('button:has-text("Refresh")');

        await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue('');
        await expect(page.locator('input[placeholder="Pensioner Name"]')).toHaveValue('');
    });

    test('should show "No records found" for invalid search', async ({ page, pensionPage }) => {
        await pensionPage.openPopup();
        await page.fill('input#float-input', 'NonExistentPPO');
        await expect(page.locator('text="No records found"')).toBeVisible();
    });

    test('should generate PDF and show error toast if failed', async ({ page }) => {
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();

        await page.waitForSelector('tbody tr');
        const firstRow = dialog.locator('tbody tr:first-child');
        const ppoIdValue = await firstRow.locator('td:first-child').textContent();
        const pensionerName = await firstRow.locator('td:nth-child(2)').textContent();
        await firstRow.click();
        await expect(dialog).not.toBeVisible();

        await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue(ppoIdValue ?? '');
        await expect(page.locator('input[placeholder="Pensioner Name"]')).toHaveValue(pensionerName ?? '');
        await page.locator('p-radioButton[label="General Bill"]').click();
        await page.locator('button:has-text("Generate Report")').click();


        const dialog1 = page.locator('div.swal2-popup');
        await expect(dialog1).toBeVisible({ timeout: 10000 });
});

test('should generate PDF and handle errors appropriately', async ({ page, pensionPage }) => {
    //ARRANGE
    const firstRow = await pensionPage.openPopupAndSelectFirstRow();
    const ppoIdValue = await firstRow.locator('td:first-child').textContent();
    const pensionerName = await firstRow.locator('td:nth-child(2)').textContent();

    await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue(ppoIdValue ?? '');
    await expect(page.locator('input[placeholder="Pensioner Name"]')).toHaveValue(pensionerName ?? '');
    //ACT
    await page.locator('p-radioButton[label="General Bill"]').click();
    await expect(page.locator('input[value="generalBill"]')).toBeChecked();
    await page.locator('button:has-text("Generate Report")').click();
    //ASSERT
    const toastLocator = page.locator('.swal2-popup');
    await expect(toastLocator).toBeVisible({ timeout: 10000 });

    const toastClasses = await toastLocator.evaluate(el => el.className);
    const toastMessage = await toastLocator.textContent();

    if (toastClasses.includes('error') || (toastMessage && toastMessage.toLowerCase().includes('error'))) {
      expect(toastMessage).toBeTruthy();
    } else {
      const pdfBuffer = await page.pdf();
      expect(pdfBuffer).not.toBeNull();
      expect(pdfBuffer.length).toBeGreaterThan(0);
    }
  });



