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
      //Arrange - going to the PPO Details page

      //Act
      const elements = [
        { locator: 'button:has-text("Add New PPO")', type: 'button' },
        { locator: '.p-fieldset-legend-text >> text=All PPO', type: 'text' },
        { locator: 'p-table', type: 'component' },
        { locator: 'label:has-text("Search") >> .. >> input', type: 'input' },
      ];
    
      //Assert
      for (const element of elements) {
        await expect(page.locator(element.locator)).toBeVisible();
      }
    });

    test('should display table with headers and data', async ({ page }) => {
      // Arrange
      await page.waitForSelector('p-table');
      
      // Act
      const headers = page.locator('p-table th');
      const headerTexts = await Promise.all(
          (await headers.elementHandles()).map(async (header) => {
              const text = await header.textContent();
              return text ? text.trim() : ''; 
          })
      );
  
      // Assert
      expect(headerTexts).toEqual([
          'PPO ID',
          'Name of Pensioner',
          'Mobile',
          'Date of Birth',
          'Date of Retirement',
          'PPO No',
          'Edit'
      ]);
      
      // Act
      const firstRow = page.locator('p-table table tr').nth(1);
      const firstRowCells = firstRow.locator('td');
      
      // Assert
      if (await firstRowCells.count() === 1 && await firstRowCells.nth(0).getAttribute('colspan') === '7') {
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
    // Arrange
    await page.click('button:has-text("Add New PPO")');
    
    // Act
    const inputFields = [
        'ppoNo',
        'pensionerName',
        'ppoType',
        'ppoSubType',
        'categoryDescription',
        'categoryIdShow',
        'subCatDesc',
        'dateOfRetirement',
        'dateOfCommencement',
        'basicPensionAmount',
        'commutedPensionAmount',
        'reducedPensionAmount',
        'religion',
        'gender',
        'effectiveDate',
        'mobileNumber',
        'emailId',
        'dateOfBirth',
        'aadhaarNo',
        'panNo',
        'identificationMark',
        'pensionerAddress'
    ];

    // Assert
    for (const field of inputFields) {
        const inputLocator = page.locator(`input[formcontrolname="${field}"], p-dropdown[formcontrolname="${field}"], p-calendar[formcontrolname="${field}"]`);
        await expect(inputLocator).toBeVisible();
    }

    // Act
    const dialogHeader = page.getByRole('dialog');
    if (await dialogHeader.isVisible()) {
        await page.click('button:has-text("Yes")');
        await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/manualPpoReceipt?returnUri=%2Fpension%2Fmodules%2Fpension-process%2Fppo%2Fentry%2Fnew`);
        
        await page.click('button:has-text("New Manual PPO Entry")');
        await page.click('button:has-text("Submit")');
        await page.waitForSelector('text=PPO Receipt added successfully');
        await expect(page.locator('text=Manual PPO receipt is created. Do you want to go back to entry form?')).toBeVisible();
        await page.click('button:has-text("Yes")');
        await expect(page).toHaveURL('/#/pension/modules/pension-process/ppo/entry/new');
    }

    // Assert
    const saveButton = page.locator('button:has-text("Save")');
    await expect(saveButton).toBeVisible();
    await page.click('button:has-text("Save")');
    
    // Assert
    await waitForToastMessage(page, 'PPO Details saved successfully!');
});

  
      
    
test('should extract a PPO No and use it for search', async ({ page }) => {
  // Arrange
  await expect(page.locator('p-table')).toBeVisible();
  const ppoNoLocator = page.locator('p-table tr:first-child td:nth-child(6)');
  const ppoNo = await ppoNoLocator.textContent();

  // Validate that a PPO No was found
  if (!ppoNo) {
      throw new Error('No PPO No found in the correct column of the table to use for searching.');
  }

  // Act
  await page.fill('label:has-text("Search") >> .. >> input', ppoNo);

  // Assert
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
  // Arrange
  const nonExistentPpoNo = 'ABC-123456'; 
  
  // Act
  await page.fill('label:has-text("Search") >> .. >> input', nonExistentPpoNo);
  
  // Assert
  await page.waitForSelector('text=No records found');
  const noRecordsMessageVisible = await page.locator('text=No records found').isVisible();
  expect(noRecordsMessageVisible).toBe(true);
});

      
    
test('should edit an existing PPO record', async ({ page }) => {
  // Arrange
  await page.click('p-button:has-text("Edit")');

  // Act
  const pensionerNameInput = page.locator('input[formcontrolname="pensionerName"]');
  await expect(pensionerNameInput).toBeVisible();
  await pensionerNameInput.fill('New Pensioner Name');
  
  await page.click('button:has-text("Save")');
  
  // Assert
  const successMessage = await page.locator('.p-toast-message-text').textContent();
  expect(successMessage).toContain('PPO Details saved sucessfully!');
});


test('Create PPO without bank details, approve, and update bank details', async ({ page }) => {
  // Arrange
  await page.click('button:has-text("Add New PPO")');
  const dialogHeader = page.getByRole('dialog');
  await expect(dialogHeader).toBeVisible();
  
  // Act
  await page.click('button:has-text("Yes")');
  await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/manualPpoReceipt?returnUri=%2Fpension%2Fmodules%2Fpension-process%2Fppo%2Fentry%2Fnew`);
  await page.click('button:has-text("New Manual PPO Entry")');
  await page.click('button:has-text("Submit")');
  
  // Assert
  await page.waitForSelector('text=PPO Receipt added successfully');
  expect(await page.isVisible('text=Manual PPO receipt is created. Do you want to go back to entry form?')).toBeTruthy();
  await page.click('button:has-text("Yes")');
  await expect(page).toHaveURL('/#/pension/modules/pension-process/ppo/entry/new');
  
  // Act
  const ppoNumberInput = page.locator('input[formcontrolname="ppoNo"]');
  await expect(ppoNumberInput).toBeVisible();
  const ppoNo = await ppoNumberInput.inputValue();

  const saveButton = page.locator('button:has-text("Save")');
  await expect(saveButton).toBeVisible();
  await page.click('button:has-text("Save")');

  const ppoIdInput = page.locator('input[formcontrolname="ppoId"]');
  await expect(ppoIdInput).toBeVisible();
  const ppoId = await ppoIdInput.inputValue();
  
  // Act
  await page.goto('/#/pension/modules/pension-process/approval/ppo-approval');
  await page.click('app-popup-table');
  await page.click(`text=${ppoNo}`);

  // Assert
  expect(await page.locator('text=Pensioner bank account not updated').isVisible()).toBe(true);

  // Act
  await page.click('button:has-text("Update Bank Account Details")');
  await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/entry/${ppoId}/bank-account?returnUri=%2Fpension%2Fmodules%2Fpension-process%2Fapproval%2Fppo-approval%2F${ppoId}`);
  await expect(page.locator('text=Bank Details')).toBeVisible();
  await expect(page.locator(`text=ID-${ppoId}`)).toBeVisible();

  await page.click('button:has-text("Save")');
  await waitForToastMessage(page, 'Bank account saved');

  // Act
  const dialogHeader1 = page.getByRole('dialog');
  await expect(dialogHeader1).toBeVisible();
  
  await page.click('button:has-text("Yes")');
  await expect(page).toHaveURL(`/#/pension/modules/pension-process/approval/ppo-approval/${ppoId}`);
  await page.click('button:has-text("Approve")');
  
  // Assert
  await page.waitForSelector('text=PPO Status Flag Set Successfully');
});

    
});
