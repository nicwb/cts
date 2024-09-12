import { test, expect } from '@playwright/test';

test.describe('PPO Details', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if(isMobile) {
            page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/ppo/entry/ppodetails');
    });

    test('should display static UI elements correctly', async ({ page }) => {
      const elements = [
        { locator: 'button:has-text("Add New PPO")', type: 'button' },
        { locator: '.p-fieldset-legend-text >> text=All PPO', type: 'text' },
        { locator: 'p-table', type: 'component' },
        { locator: 'label:has-text("Search") >> .. >> input', type: 'input' },
      ];
    
      for (const element of elements) {
        await expect(page.locator(element.locator)).toBeVisible();
      }
    });

      test('should display table with headers and data', async ({ page }) => {
        await page.waitForSelector('p-table');
        const headers = page.locator('p-table th');
        const headerTexts = await Promise.all((await headers.elementHandles()).map((header) => header.textContent()));
        expect(headerTexts).toEqual([
          'PPO ID',
          'Name of Pensioner',
          'Mobile',
          'Date of Birth',
          'Date of Retirement',
          'PPO No',
          'Edit'
        ]);
      
        const firstRow = page.locator('table tr').nth(1);
        const firstRowCells = firstRow.locator('td');
        if ((await firstRowCells.count()) === 1 && await firstRowCells.nth(0).getAttribute('colspan') === '7') {
          expect(await firstRowCells.nth(0).textContent()).toBe('No records found');
        } else {
          expect(await firstRowCells.count()).toBe(7);
          const firstRowCellTexts = await Promise.all(
            (await firstRowCells.elementHandles()).map((cell) => cell.textContent())
          );
          expect(firstRowCellTexts).not.toContain('');
        }
      });
    
      test('should switch to new PPO entry mode', async ({ page }) => {
        await page.waitForTimeout(500);
        await page.click('button:has-text("Add New PPO")');
        await expect(page.locator('p-steps')).toBeVisible();
        const ppoNumberInput = await page.locator('input[formcontrolname="ppoNo"]');
        await expect(ppoNumberInput).toBeVisible();

        
        const pensionerNameInput = await page.locator('input[formcontrolname="pensionerName"]');
        await expect(pensionerNameInput).toBeVisible();

        const typeDropdown = await page.locator('p-dropdown[formcontrolname="ppoType"]');
        await expect(typeDropdown).toBeVisible();

        
        const subTypeDropdown = await page.locator('p-dropdown[formcontrolname="ppoSubType"]');
        await expect(subTypeDropdown).toBeVisible();

        
        const searchInput = await page.locator('label[for="float-input"]').filter({ hasText: 'e-PPO Application No/TRID' });
        await expect(searchInput).toBeVisible();
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await page.waitForTimeout(500);
        await expect(dialog).toBeVisible();
        
        await expect(dialog.locator('label[for="float-input"]')).toHaveText('Search data');
        await expect(dialog.locator('input#float-input')).toBeVisible();
        
        const tableHeaders = ['Treasury Receipt No', 'PPO No', 'Name of Pensioner', 'Date of Receipt', 'Date of Commencement'];
        for (const header of tableHeaders) {
            await expect(dialog.locator(`th:has-text("${header}")`)).toBeVisible();
        }
        await page.waitForSelector('tbody tr');
        const firstRow = dialog.locator('tbody tr:first-child');
        const ppoIdValue = await firstRow.locator('td:first-child').textContent();
        const commencementDateValue = await firstRow.locator('td:nth-child(5)').textContent(); 
        const parsedDate = commencementDateValue?.trim() ? new Date(commencementDateValue) : null;
        await firstRow.click();
        

        const catDescriptionInput = await page.locator('input[formcontrolname="categoryDescription"]');
        await expect(catDescriptionInput).toBeVisible();
        
        const catSubCatIdInput = await page.locator('input[formcontrolname="categoryIdShow"]');
        const catSubDesc= await page.locator('input[formcontrolname="subCatDesc"]');
        await expect(catSubCatIdInput).toBeVisible();
        await expect(catSubDesc).toBeVisible();
        
        const retirementDateInput = await page.locator('p-calendar[formcontrolname=dateOfRetirement]');
        await expect(retirementDateInput).toBeVisible();

        const dateOfCommencementInput = await page.locator('p-calendar[formcontrolname=dateOfCommencement]');
        await expect(dateOfCommencementInput).toBeVisible();

        const basicInput = await page.locator('input[formcontrolname="basicPensionAmount"]');
        await expect(basicInput).toBeVisible();
 
        const commutedPensionInput = await page.locator('input[formcontrolname="commutedPensionAmount"]');
        await expect(commutedPensionInput).toBeVisible();
        
        const reducedPensionInput = await page.locator('input[formcontrolname="reducedPensionAmount"]');
        await expect(reducedPensionInput).toBeVisible();
        
        const religionDropdown = await page.locator('p-dropdown[formcontrolname="religion"]');
        await expect(religionDropdown).toBeVisible();
        
        const genderDropdown = await page.locator('p-dropdown[formcontrolname="gender"]');
        await expect(genderDropdown).toBeVisible();
        
        const effectiveDateInput = await page.locator('p-calendar[formcontrolname="effectiveDate"]');
        await expect(effectiveDateInput).toBeVisible();

        const mobileNoInput = await page.locator('input[formcontrolname="mobileNumber"]');
        await expect(mobileNoInput).toBeVisible();

        const emailInput = await page.locator('input[formcontrolname="emailId"]');
        await expect(emailInput).toBeVisible();

        const birthDateInput = await page.locator('p-calendar[formcontrolname="dateOfBirth"]');
        await expect(birthDateInput).toBeVisible();

        const aadharNoInput = await page.locator('input[formcontrolname="aadhaarNo"]');
        await expect(aadharNoInput).toBeVisible();

        const panNoInput = await page.locator('input[formcontrolname="panNo"]');
        await expect(panNoInput).toBeVisible();

        const identificationMarkInput = await page.locator('input[formcontrolname="identificationMark"]');
        await expect(identificationMarkInput).toBeVisible();

        const addressInput = await page.locator('input[formcontrolname="pensionerAddress"]');
        await expect(addressInput).toBeVisible();

        const saveButton = await page.locator('button:has-text("Save")');
        await expect(saveButton).toBeVisible();

        const backButton = await page.locator('button:has-text("Back")');
        const nextButton = await page.locator('button:has-text("Next")');
        await expect(backButton).toBeVisible();
        await expect(nextButton).toBeVisible();

        await page.click('button:has-text("Save")');
        const successMessage = await page.locator('.p-toast-message-text').textContent();
        expect(successMessage).toContain('PPO Details saved sucessfully!');
      });
      
    
    test('should extract a PPO No and use it for search', async ({ page }) => {
        await expect(page.locator('p-table')).toBeVisible();
        const ppoNoLocator = page.locator('p-table tr:first-child td:nth-child(6)'); 
        const ppoNo = await ppoNoLocator.textContent();
      
        if (!ppoNo) {
          throw new Error('No PPO No found in the correct column of the table to use for searching.');
        }
      
        await page.fill('label:has-text("Search") >> .. >> input', ppoNo);
      
        const matchingRowCount = await page.locator(`p-table tr:has-text("${ppoNo}")`).count();
        const totalRowCount = await page.locator('p-table tr').count();
      
        if (matchingRowCount === 1) {
            const rowText = await page.locator(`p-table tr:has-text("${ppoNo}")`).textContent();
            expect(rowText).toContain(ppoNo);
          } else {
            expect(totalRowCount).toBeGreaterThan(0);
          }
      });
      
      test('should display "No records found" when PPO No does not match', async ({ page }) => {
        const nonExistentPpoNo = 'ABC-123456'; 
        await page.fill('label:has-text("Search") >> .. >> input', nonExistentPpoNo);
        await page.waitForSelector('text=No records found');
        expect(await page.locator('text=No records found').isVisible()).toBe(true);
      });
      
    
      test('should edit an existing PPO record', async ({ page }) => {
        await page.waitForTimeout(500);
        await page.click('p-button:has-text("Edit")');
        await expect(page.locator('p-steps')).toBeVisible();
        const pensionerNameInput = await page.locator('input[formcontrolname="pensionerName"]');
        await expect(pensionerNameInput).toBeVisible();
        await pensionerNameInput.fill('New Pensioner Name');
        await page.click('button:has-text("Save")');
        const successMessage = await page.locator('.p-toast-message-text').textContent();
        expect(successMessage).toContain('PPO Details saved sucessfully!');
      });
});
