import { test, expect } from "@playwright/test";

test.describe('Pension Component Rate Details', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if (isMobile) {
            await page.locator('button.layout-topbar-menu-button').click();
        }
        const dashboard = page.getByText('CCTSCLERK');
        await expect(dashboard).toBeVisible();
        
        await page.goto('/#/master/app-pension/component-rate-revisions');
    });

    test('Check if the form elements are visible', async ({ page }) => {
        //Arrange - going to the component rate revisions page
        // Act
        const elements = [
            page.getByText('Pension Component Rate Details'),
            page.getByPlaceholder('Pension Category ID'),
            page.getByPlaceholder('Description'),
            page.getByRole('button', { name: 'Search' }),
            page.getByRole('button', { name: 'Refresh' }),
        ];

        // Assert
        for (const element of elements) {
            await expect(element).toBeVisible();
        }
      });
    
    test('Check if the "New Component Rate" button navigates correctly', async ({ page }) => {
        // Arrange- going to the component rate revisions page
        // Act
        await page.getByRole('button', { name: 'New Component Rate' }).click();

        // Assert
        await expect(page).toHaveURL('/#/master/app-pension/component-rate');
        await expect(page.getByRole('heading', { name: 'Component Rate' }).locator('b')).toBeVisible();
    });
    

    test('Check form validation, reset, and refresh', async ({ page }) => {
        // Arrange
        await expect(page.getByRole('button', { name: 'Search' })).toBeDisabled();
      
        // Act
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
      
        const firstRow = dialog.locator('tbody tr:first-child');
        await page.waitForSelector('tbody tr:first-child', { timeout: 500 });
        await firstRow.click();
      
        // Assert
        await expect(page.locator('input[formControlName="categoryId"]')).toBeVisible();
        await expect(page.locator('input[formControlName="description"]')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Search' })).toBeEnabled();
      
        // Act
        await page.getByRole('button', { name: 'Refresh' }).click();
      
        // Assert
        await expect(page.locator('input[formControlName="categoryId"]')).toHaveValue('');
        await expect(page.locator('input[formControlName="description"]')).toHaveValue('');
        await expect(page.getByRole('button', { name: 'Search' })).toBeDisabled();
        await expect(page.getByPlaceholder('Pension Category ID')).toHaveValue('');
        await expect(page.getByPlaceholder('Description')).toHaveValue('');
      });
    

      test('Check Pension Component Rate form and perform search', async ({ page }) => {
        // ARRANGE
        const dialog = page.locator('div[role="dialog"]');
        const table = page.locator('p-table');
        const firstRow = dialog.locator('tbody tr:first-child');
        const searchButton = page.getByRole('button', { name: 'Search' });
    
        const expectedDialogHeaders = ['Category ID', 'Primary Category ID', 'Sub Category ID', 'Category Name'];
        const expectedTableHeaders = ['Component Rate ID', 'Category ID', 'Bill Breakup ID', 'Effective From Date', 'Rate Amount', 'Rate Type'];
      
        await page.click('app-popup-table');
        await expect(dialog).toBeVisible();
      
        for (const header of expectedDialogHeaders) {
          await expect(dialog.locator('th').filter({ hasText: header }).first()).toBeVisible();
        }
      
        await firstRow.waitFor({ state: 'visible', timeout: 500 });
      
        // ACT
        await firstRow.click();
      
        await searchButton.click();
      
        // ASSERT
        await expect(page.locator('input[formControlName="categoryId"]')).toBeVisible();
        await expect(page.locator('input[formControlName="description"]')).toBeVisible();
     
        await expect(table).toBeVisible();
      
        const rows = table.locator('tbody tr');
        const rowCount = await rows.count();
      
        expect(rowCount).toBeGreaterThan(0);
      
        const firstRowText = await rows.first().textContent();
      
        expect(firstRowText).toBeTruthy();
      
        if (!firstRowText?.includes('No records found')) {
          for (let i = 0; i < expectedTableHeaders.length; i++) {
            const cell = table.locator(`td:nth-child(${i + 1})`).first();
            await expect(cell).toBeVisible();
            const cellText = await cell.textContent();
            expect(cellText).toBeTruthy();
          }
        }
      });
    

});
