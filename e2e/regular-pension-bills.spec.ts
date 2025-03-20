import { test, expect, Seeders } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
    await dbUtils.dropDatabase();
    await dbUtils.migrateDatabase();
    await dbUtils.seedDatabase(Seeders.DatabaseSeeder);
    await pensionPage.savePpoDetailsApproveGenerateFirstPensionBillAndRegularPensionBill();
    await pensionPage.goToRegularPensionBillPrint();
});

test('Generate Regular Pension Bill PDF Report', async ({
    page,
    pensionPage,
}) => {
    // ARRANGE
    const monthDropdown = page.locator(
        'p-dropdown[formControlName="months"] .p-dropdown-label'
    );
    await expect(monthDropdown).toBeVisible();
    const yearCalendar = page.locator(
        'p-calendar[formControlName="year"] input'
    );
    await expect(yearCalendar).toBeVisible();
    const selectedMonth = await monthDropdown.innerText();
    const selectedYear = await yearCalendar.inputValue();
    await monthDropdown.click();

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const currentIndex = months.indexOf(selectedMonth);
    let nextMonth = '';

    if (currentIndex === 11) {
        nextMonth = 'January';
        await pensionPage.page
            .locator('p-calendar[formcontrolname="year"]')
            .click();
        await pensionPage.page.keyboard.press('ArrowUp');
    } else {
        nextMonth = months[currentIndex + 1];
    }

    await pensionPage.page.getByRole('option', { name: nextMonth }).click();

    // ACT
    const allBankRadioButton = page
        .locator('p-radiobutton')
        .filter({ hasText: 'All Bank/ All Category' });
    await allBankRadioButton.click();
    const generateReportButton = page.getByRole('button', {
        name: 'Generate Report',
    });
    await expect(generateReportButton).toBeEnabled();
    await generateReportButton.click();
    const dialog = page.locator('.p-dialog');
    await dialog.waitFor({ state: 'visible' });

    // ASSERT
    const dialogMessage = await dialog.innerText();
    const expectedMessage = `Status: PDF "Regular Pension Bill for ${nextMonth} ${selectedYear}" has been generated.`;

    expect(dialogMessage).toContain(expectedMessage);
    const ppoCountMatch = dialogMessage.match(/Number of PPOs: (\d+)/);
    expect(ppoCountMatch).not.toBeNull();
    const ppoCount = parseInt(ppoCountMatch![1]);
    expect(ppoCount).toBeGreaterThanOrEqual(0);
});
