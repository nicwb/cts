import {test,expect} from "@playwright/test";

test.describe('Component Rate component', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if(isMobile) {
            page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        // Navigate to the page containing your component
        await page.goto('/#/master/app-pension/component-rate');
    });

    test('should display the "Component Rate" page', async ({ page }) => {
        //Arrange - going to the component rate page
        //Act
        const elements = [
            { locator: 'text=Component Rate', type: 'text' },
            { locator: 'text=Select Pension Category', type: 'text' },
            { locator: 'text=Select Component', type: 'text' },
            { locator: 'text=Date', type: 'text' },
            { locator: 'text=Rate Type P/A', type: 'text' },
            { locator: 'text=Amount/Percentage', type: 'text' },
            { locator: 'button >> text="Submit"', type: 'button' },
            { locator: 'button >> text="Refresh"', type: 'button' }
        ];

        // Assert
        await Promise.all(elements.map(element =>
            expect(page.locator(element.locator)).toBeVisible()
        ));
        const element = await page.locator('form button').nth(1);
        await expect(element).toBeVisible();
        const element1 = await page.locator('form button').first();
        await expect(element1).toBeVisible();
    });

    test('Check form validation, reset, and refresh', async ({ page }) => {
        // Arrange
        await expect(page.getByRole('button', { name: ' Submit' })).toBeDisabled();
      
        // Act
        const element1 = await page.locator('form button').first();
        await expect(element1).toBeVisible();
        await element1.click();
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
      
        const firstRow = dialog.locator('tbody tr:first-child');
        await page.waitForSelector('tbody tr:first-child', { timeout: 500 });
        await firstRow.click();

        const element = await page.locator('form button').nth(1);
        await expect(element).toBeVisible();
        await element.click();
        const dialog1 = page.locator('div[role="dialog"]');
        await expect(dialog1).toBeVisible();
      
        const firstRow1 = dialog1.locator('tbody tr:first-child');
        await page.waitForSelector('tbody tr:first-child', { timeout: 500 });
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
        // Step 1: Add new component
        const addComponentButton = page.locator('form button').first();
        await Promise.all([
            addComponentButton.click(),
            page.locator('div[role="dialog"]').waitFor({ state: 'visible' })  // Wait for the dialog
        ]);
    
        const firstRow = page.locator('tbody tr:first-child');
        await firstRow.click();  // No need for an explicit waitForSelector, the dialog is already visible
    
        // Step 2: Select pension category
        const pensionCategoryButton = page.locator('form button').nth(1);
        await Promise.all([
            pensionCategoryButton.click(),
            page.locator('div[role="dialog"]').waitFor({ state: 'visible' })  // Wait for the dialog
        ]);
    
        const firstCategoryRow = page.locator('tbody tr:first-child');
        await firstCategoryRow.click();
    
        // Step 3: Set a unique future date (within the next 100 days)
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

    
        // Step 4: Set rate type
        const rateDropdown = page.locator('p-dropdown[formControlName="rateType"]');
        await Promise.all([
            rateDropdown.click(),
            page.locator('.p-dropdown-item >> text=A').click()
        ]);
    
        // Step 5: Set random rate amount
        const rateAmount = Math.floor(Math.random() * 100);
        await page.fill('input[formControlName="rateAmount"]', rateAmount.toString());
    
        // Assert form fields and submit button
        await Promise.all([
            expect(page.locator('input[formControlName="categoryName"]')).toBeVisible(),
            expect(page.locator('input[formControlName="componentName"]')).toBeVisible(),
            expect(page.locator('p-calendar[formControlName="effectiveFromDate"]')).toBeVisible(),
            expect(page.locator('p-dropdown[formControlName="rateType"]')).toBeVisible(),
            expect(page.locator('input[formControlName="rateAmount"]')).toBeVisible(),
            expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled()
        ]);
    
        // Submit the form
        await page.getByRole('button', { name: 'Submit' }).click();
    
        // Assert success message and interaction
        await page.getByRole('button', { name: 'OK' }).click();
        await expect(page.locator('p-table')).toBeVisible();
    });
    

    test('should show correct table', async({page}) => {
       // Act
       const element1 = await page.locator('form button').first();
       await expect(element1).toBeVisible();
       await element1.click();
       const dialog = page.locator('div[role="dialog"]');
       await expect(dialog).toBeVisible();
     
       const firstRow = dialog.locator('tbody tr:first-child');
       await page.waitForSelector('tbody tr:first-child', { timeout: 500 });
       await firstRow.click();

       const element = await page.locator('form button').nth(1);
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
    })
});