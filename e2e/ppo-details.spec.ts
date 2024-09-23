import { test, expect, Page } from '@playwright/test';

async function waitForToastMessage(page: Page, expectedText: string, timeout = 5000): Promise<void> {
    await page.waitForFunction(
      (text) => {
        const toasts = Array.from(document.querySelectorAll('.p-toast-message-text'));
        return toasts.some(toast => toast.textContent?.includes(text));
      },
      expectedText,
      { timeout }
    );
  }

test.describe('PPO Details', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if(isMobile) {
            page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/ppo/entry');
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
      const headerTexts = await Promise.all(
        (await headers.elementHandles()).map(async (header) => {
          const text = await header.textContent();
          return text ? text.trim() : ''; 
        })
      );
      
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
      await page.click('button:has-text("Add New PPO")');
      const ppoNumberInput = page.locator('input[formcontrolname="ppoNo"]');
      await expect(ppoNumberInput).toBeVisible();
  
      const pensionerNameInput = page.locator('input[formcontrolname="pensionerName"]');
      await expect(pensionerNameInput).toBeVisible();
      const typeDropdown = page.locator('p-dropdown[formcontrolname="ppoType"]');
      await expect(typeDropdown).toBeVisible();
  
      const subTypeDropdown = page.locator('p-dropdown[formcontrolname="ppoSubType"]');
      await expect(subTypeDropdown).toBeVisible();
  
      const searchInput = page.locator('label[for="float-input"]').filter({ hasText: 'e-PPO Application No/TRID' });
      await expect(searchInput).toBeVisible();
  
      const catDescriptionInput = page.locator('input[formcontrolname="categoryDescription"]');
      await expect(catDescriptionInput).toBeVisible();
  
      const catSubCatIdInput = page.locator('input[formcontrolname="categoryIdShow"]');
      const catSubDesc = page.locator('input[formcontrolname="subCatDesc"]');
      await expect(catSubCatIdInput).toBeVisible();
      await expect(catSubDesc).toBeVisible();
  
      const retirementDateInput = page.locator('p-calendar[formcontrolname=dateOfRetirement]');
      await expect(retirementDateInput).toBeVisible();
  
      const dateOfCommencementInput = page.locator('p-calendar[formcontrolname=dateOfCommencement]');
      await expect(dateOfCommencementInput).toBeVisible();
  
      const basicInput = page.locator('input[formcontrolname="basicPensionAmount"]');
      await expect(basicInput).toBeVisible();
  
      const commutedPensionInput = page.locator('input[formcontrolname="commutedPensionAmount"]');
      await expect(commutedPensionInput).toBeVisible();
  
      const reducedPensionInput = page.locator('input[formcontrolname="reducedPensionAmount"]');
      await expect(reducedPensionInput).toBeVisible();
  
      const religionDropdown = page.locator('p-dropdown[formcontrolname="religion"]');
      await expect(religionDropdown).toBeVisible();
  
      const genderDropdown = page.locator('p-dropdown[formcontrolname="gender"]');
      await expect(genderDropdown).toBeVisible();
  
      const effectiveDateInput = page.locator('p-calendar[formcontrolname="effectiveDate"]');
      await expect(effectiveDateInput).toBeVisible();
  
      const mobileNoInput = page.locator('input[formcontrolname="mobileNumber"]');
      await expect(mobileNoInput).toBeVisible();
  
      const emailInput = page.locator('input[formcontrolname="emailId"]');
      await expect(emailInput).toBeVisible();
  
      const birthDateInput = page.locator('p-calendar[formcontrolname="dateOfBirth"]');
      await expect(birthDateInput).toBeVisible();
  
      const aadharNoInput = page.locator('input[formcontrolname="aadhaarNo"]');
      await expect(aadharNoInput).toBeVisible();
  
      const panNoInput = page.locator('input[formcontrolname="panNo"]');
      await expect(panNoInput).toBeVisible();
  
      const identificationMarkInput = page.locator('input[formcontrolname="identificationMark"]');
      await expect(identificationMarkInput).toBeVisible();
  
      const addressInput = page.locator('input[formcontrolname="pensionerAddress"]');
      await expect(addressInput).toBeVisible();

      const dialogHeader = page.getByRole('dialog')
      const isModalVisible = await dialogHeader.isVisible();
      
        if (isModalVisible) {
            await page.click('button:has-text("Yes")');
            await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/manualPpoReceipt?returnUri=%2Fpension%2Fmodules%2Fpension-process%2Fppo%2Fentry%2Fnew`);
            await page.click('button:has-text("New Manual PPO Entry")');
            await page.click('button:has-text("Submit")');
            await page.waitForSelector('text=PPO Receipt added successfully');
            await page.isVisible('text=Manual PPO receipt is created. Do you want to go back to entry form?');
            await page.click('button:has-text("Yes")');
            await expect(page).toHaveURL('/#/pension/modules/pension-process/ppo/entry/new');
        }
  
      const saveButton = page.locator('button:has-text("Save")');
      await expect(saveButton).toBeVisible();
  
      await page.click('button:has-text("Save")');
  
      await waitForToastMessage(page, 'PPO Details saved sucessfully!');
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
        await page.click('p-button:has-text("Edit")');
        const pensionerNameInput = page.locator('input[formcontrolname="pensionerName"]');
        await expect(pensionerNameInput).toBeVisible();
        await pensionerNameInput.fill('New Pensioner Name');
    
        await page.click('button:has-text("Save")');
    
        const successMessage = await page.locator('.p-toast-message-text').textContent();
        await expect(successMessage).toContain('PPO Details saved sucessfully!');
    });

    test('Create PPO without bank details, approve, and update bank details', async ({ page}) => {
        await page.click('button:has-text("Add New PPO")');
        const dialogHeader = page.getByRole('dialog')
        const isModalVisible = await dialogHeader.isVisible();
      
        if (isModalVisible) {
            await page.click('button:has-text("Yes")');
            await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/manualPpoReceipt?returnUri=%2Fpension%2Fmodules%2Fpension-process%2Fppo%2Fentry%2Fnew`);
            await page.click('button:has-text("New Manual PPO Entry")');
            await page.click('button:has-text("Submit")');
            await page.waitForSelector('text=PPO Receipt added successfully');
            await page.isVisible('text=Manual PPO receipt is created. Do you want to go back to entry form?');
            await page.click('button:has-text("Yes")');
            await expect(page).toHaveURL('/#/pension/modules/pension-process/ppo/entry/new');
        }
    
        const ppoNumberInput = page.locator('input[formcontrolname="ppoNo"]');
        await expect(ppoNumberInput).toBeVisible();
        const ppoNo = await ppoNumberInput.inputValue();

        const saveButton = page.locator('button:has-text("Save")');
        await expect(saveButton).toBeVisible();
        await page.click('button:has-text("Save")');

        const ppoIdInput = page.locator('input[formcontrolname="ppoId"]');
        await expect(ppoIdInput).toBeVisible();
        const ppoId = await ppoIdInput.inputValue();
        
        await page.goto('/#/pension/modules/pension-process/approval/ppo-approval');
    
        await page.click('app-popup-table');
        await page.click(`text=${ppoNo}`);
    
        const bankDetailsMessage = await page.locator('text=Pensioner bank account not updated').isVisible();
        expect(bankDetailsMessage).toBeTruthy();
    
        await page.click('button:has-text("Update Bank Account Details")');
    
        await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/entry/${ppoId}/bank-account?returnUri=%2Fpension%2Fmodules%2Fpension-process%2Fapproval%2Fppo-approval%2F${ppoId}`);
        await expect(page.locator('text=Bank Details')).toBeVisible();
        await expect(page.locator(`text=ID-${ppoId}`)).toBeVisible();
    
        await page.click('button:has-text("Save")');
        await waitForToastMessage(page, 'Bank account saved');

        const dialogHeader1 = page.getByRole('dialog')
        const isModalVisible1 = await dialogHeader1.isVisible();
      
        if (isModalVisible1) {
            await page.click('button:has-text("Yes")');
            await expect(page).toHaveURL(`/#/pension/modules/pension-process/approval/ppo-approval/${ppoId}`);
            await page.click('button:has-text("Approve")');
            await page.waitForSelector('text=PPO Status Flag Set Successfully');
        }
    });
    
});
