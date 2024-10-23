import {test,expect} from "./fixtures";

test.beforeEach(async ({ page, pensionPage }) => {
    // test.fixme(true, 'Remove this line after task-241 is merged');
    await pensionPage.staticLogin();
    // Navigate to the page containing your component
    await page.goto('/master/component-rate');
});

test('should display the "Component Rate" page', async ({ page }) => {
    // Arrange - go to the component rate page
    // await page.goto('/component-rate'); // Assuming you have a route

    // Define expected elements with more specific locators
    const elements = [
        { locator: page.getByRole('heading', { name: 'Component Rate' }).locator('b')},  // For the heading
        { locator: page.getByText('Select Pension Category') },
        { locator: page.getByText('Select Component'), type: 'text' },
        { locator: page.getByText('Date'), type: 'text' },
        { locator: page.getByText('Rate Type P/A'), type: 'text' },
        { locator: page.getByText('Amount/Percentage'), type: 'text' },
        { locator: page.getByRole('button', { name: 'Submit' }), type: 'button' },  // For the "Submit" button
        { locator: page.getByRole('button', { name: 'Refresh' }), type: 'button' }  // For the "Refresh" button
    ];

    // Assert visibility of all elements
    await Promise.all(elements.map(element =>
        expect(element.locator).toBeVisible()
    ));

    // Additional checks if needed
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeVisible();

    const refreshButton = page.getByRole('button', { name: 'Refresh' });
    await expect(refreshButton).toBeVisible();
});


test('Check form validation, reset, and refresh', async ({ page }) => {
    // Arrange
    await expect(page.getByRole('button', { name: ' Submit' })).toBeDisabled();

    // Act
    const element1 = page.locator('form button').first();
    await expect(element1).toBeVisible();
    await element1.click();
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    const firstRow = dialog.locator('tbody tr:first-child');
    await page.waitForSelector('tbody tr:first-child');
    await firstRow.click();

    const element = page.locator('form button').nth(1);
    await expect(element).toBeVisible();
    await element.click();
    const dialog1 = page.locator('div[role="dialog"]');
    await expect(dialog1).toBeVisible();

    const firstRow1 = dialog1.locator('tbody tr:first-child');
    await page.waitForSelector('tbody tr:first-child');
    await firstRow1.click();

    const cal = page.locator('p-calendar[formControlName="effectiveFromDate"]');
    await expect(cal).toBeVisible();
    await cal.click();
    await page.locator('.p-datepicker-today').click();

    const rate = page.locator('p-dropdown[formControlName="rateType"]');
    await expect(rate).toBeVisible();
    await rate.click();
    await page.locator('.p-dropdown-item >> text=A').click();

    const rateAmount = Math.floor(Math.random() * 100);
    await page.fill('input[formControlName="rateAmount"]', rateAmount.toString());

    // Assert
    await expect(page.locator('input[formControlName="categoryName"]')).toBeVisible();
    await expect(page.locator('input[formControlName="componentName"]')).toBeVisible();
    await expect(page.locator('p-calendar[formControlName="effectiveFromDate"]')).toBeVisible();
    await expect(page.locator('p-dropdown[formControlName="rateType"]')).toBeVisible();
    await expect(page.locator('input[formControlName="rateAmount"]')).toBeVisible();
    await expect(page.getByRole('button', { name: ' Submit' })).toBeEnabled();

    // Act
    await page.getByRole('button', { name: 'Refresh' }).click();

    // Assert
    await expect(page.locator('input[formControlName="categoryName"]')).toHaveValue('');
    await expect(page.locator('input[formControlName="componentName"]')).toHaveValue('');
    await expect(page.locator('input[formControlName="rateAmount"]')).toHaveValue('');
    await expect(page.getByRole('button', { name: ' Submit' })).toBeDisabled();
});

test('should add new component, submit form with valid date, and display success message', async ({ page }) => {
    // Step 1: Add pension category
    await page.goto("/master/pension-category");
    await page.getByRole('button', { name: 'New' }).click();
    await page.getByRole('button', { name: 'New Primary' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'New Sub' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.goto('/master/component');
    await page.getByRole('button', { name: 'New' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.goto('/master/component-rate');
    await expect(page.locator('form button').first()).toBeVisible();
    await page.locator('form button').first().click();
    let a = await page.locator('button.p-element.p-paginator-last').isEnabled();
    if (a){
        await page.locator('button.p-element.p-paginator-last').click();
    }
    await page.locator('tbody tr:last-child').click();


    // // Step 2: Select pension component
    await expect(page.locator('form button').nth(1)).toBeVisible();
    await page.locator('form button').nth(1).click();
    a = await page.locator('button.p-element.p-paginator-last').isEnabled();
    if (a){
        await page.locator('button.p-element.p-paginator-last').click();
    }
    await page.locator('tbody tr:last-child').click();


    //  Step 3: Set a unique future date (within the next 100 days)
    await page.locator('p-calendar').getByRole('button').click();
    await page.getByText('24', { exact: true }).click();



    // // Step 4: Set rate type
    const rateDropdown = page.locator('p-dropdown[formControlName="rateType"]');
    await Promise.all([
        rateDropdown.click(),
        page.locator('.p-dropdown-item >> text=A').click()
    ]);

    // // Step 5: Set random rate amount
    const rateAmount = Math.floor(Math.random() * 100);
    await page.fill('input[formControlName="rateAmount"]', rateAmount.toString());

    // Submit the form
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByLabel('Success')).toContainText(
        'Component Rate saved sucessfully!');
});


test('should show correct table', async({page}) => {
    // Act
    const element1 = page.locator('form button').first();
    await expect(element1).toBeVisible();
    await element1.click();
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    const firstRow = dialog.locator('tbody tr:first-child');
    await page.waitForSelector('tbody tr:first-child', { timeout: 500 });
    await firstRow.click();

    const element = page.locator('form button').nth(1);
    await expect(element).toBeVisible();
    await element.click();
    const dialog1 = page.locator('div[role="dialog"]');
    await expect(dialog1).toBeVisible();

    const firstRow1 = dialog1.locator('tbody tr:first-child');
    await page.waitForSelector('tbody tr:first-child', { timeout: 500 });
    await firstRow1.click();

    const calendarWrapper = page.locator('p-calendar[formControlName="effectiveFromDate"]');
    await calendarWrapper.click();

    const randomDaysFromNow = Math.floor(Math.random() * 100) + 1;
    const randomFutureDate = new Date();
    randomFutureDate.setDate(randomFutureDate.getDate() + randomDaysFromNow);

    const randomFutureDay = randomFutureDate.getDate();
    await page
        .locator(`.p-datepicker-calendar td:not(.p-disabled)`)
        .locator(`text="${randomFutureDay}"`)
        .first()
        .click();



    const rate = page.locator('p-dropdown[formControlName="rateType"]');
    await expect(rate).toBeVisible();
    await rate.click();
    await page.locator('.p-dropdown-item >> text=A').click();

    const rateAmount = Math.floor(Math.random() * 100);
    await page.fill('input[formControlName="rateAmount"]', rateAmount.toString());

    // Assert
    await expect(page.locator('input[formControlName="categoryName"]')).toBeVisible();
    await expect(page.locator('input[formControlName="componentName"]')).toBeVisible();
    await expect(page.locator('p-calendar[formControlName="effectiveFromDate"]')).toBeVisible();
    await expect(page.locator('p-dropdown[formControlName="rateType"]')).toBeVisible();
    await expect(page.locator('input[formControlName="rateAmount"]')).toBeVisible();
    await expect(page.getByRole('button', { name: ' Submit' })).toBeEnabled();

    // Act
    await page.getByRole('button', { name: 'Submit' }).click();

    // Assert
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.locator('p-table')).toBeVisible();

    //Arrange
    const table = page.locator('p-table');
    await expect(table).toBeVisible();

    //Act
    const expectedHeaders = ['Component Rate ID', 'Category ID', 'Bill Breakup ID', 'Effective From Date', 'Rate Amount', 'Rate Type'];

    //Assert
    await Promise.all(expectedHeaders.map(header =>
        expect(table.locator(`th:has-text("${header}")`)).toBeVisible()
    ));

    //Act
    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    const firstRowText = await rows.first().textContent();

    //Assert
    expect(rowCount).toBeGreaterThan(0);

    expect(firstRowText).toBeTruthy();

    if (!firstRowText?.includes('No records found')) {
        for (let i = 0; i < expectedHeaders.length; i++) {
            const cell = table.locator(`td:nth-child(${i + 1})`).first();
            await expect(cell).toBeVisible();
            const cellText = await cell.textContent();
            expect(cellText).toBeTruthy();
        }
    }
});
