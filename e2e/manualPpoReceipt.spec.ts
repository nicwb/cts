import { test, expect } from '@playwright/test';
import { DotEnv } from "utils/env"

test.describe('Manual PPO Receipt Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbiI6IntcIklkXCI6MyxcIk5hbWVcIjpcIkNUU1wiLFwiTGV2ZWxzXCI6W3tcIklkXCI6OCxcIk5hbWVcIjpcIlRyZWFzdXJ5XCIsXCJTY29wZVwiOltcIkRBQVwiXX1dLFwiUm9sZXNcIjpbe1wiSWRcIjoyNyxcIk5hbWVcIjpcImNsZXJrXCIsXCJQZXJtaXNzaW9uc1wiOltcImNhbi1yZWNlaXZlLWJpbGxcIl19XX0iLCJuYW1laWQiOiIzOSIsIm5hbWUiOiJDVFMgQ2xlcmsiLCJuYmYiOjE3MTc5OTY2OTksImV4cCI6MTcxODA4MzA5OSwiaWF0IjoxNzE3OTk2Njk5fQ.tLMRXKlXb2eyiE2ApSRgFgbX9EjvPbGNi1dgp_UpGadv-UitDdS4su2ZV6B4kp4Rf0TXjDQHTW7YvNkwciQVQg',
    });
    // Navigate to the page containing your component
    await page.goto('/#/pension/modules/pension-process/ppo/manualPpoReceipt');
  });

  test('should display the "New Manual PPO Entry" button', async ({ page }) => {
    const newEntryButton = page.locator('button:has-text("New Manual PPO Entry")');
    await expect(newEntryButton).toBeVisible();
  });

  test('should open the modal when "New Manual PPO Entry" button is clicked', async ({ page }) => {
    // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
    // console.log('Attempting to click the "New Manual PPO Entry" button');
    await page.click('button:has-text("New Manual PPO Entry")');
    
    // console.log('Button clicked, waiting for 1 second');
    // await page.waitForTimeout(10000);
  
  
    // console.log('Attempting to locate the modal dialog');
  
    // Array of possible selectors for the modal
    const possibleSelectors = [
      'p-dialog',
      '.p-dialog',
      '.modal',
      '.dialog',
      '[role="dialog"]',
      '#manualPpoDialog', 
      'div:has-text("Manual PPO Receipt")', 
      '.p-dialog-content', 
      '.p-dialog-header', 
    ];
  
    let modalElement = null;
  
    for (const selector of possibleSelectors) {
      // console.log(`Trying selector: ${selector}`);
      const element = page.locator(selector);
      const count = await element.count();
      if (count > 0) {
        // console.log(`Found ${count} elements with selector: ${selector}`);
        const isVisible = await element.isVisible();
        // console.log(`Is element visible? ${isVisible}`);
        if (isVisible) {
          modalElement = element;
          break;
        }
      }
    }
  
    if (modalElement) {
      // console.log('Modal found, checking visibility');
      try {
        // await expect(modalElement).toBeVisible({ timeout: 10000 });
        // console.log('Modal is visible');
  
        // Log the HTML content of the modal
        const modalHTML = await modalElement.evaluate(el => el.outerHTML);
        // console.log('Modal HTML:', modalHTML);
      } catch (error) {
        console.error('Error while waiting for modal to be visible:', error);
        throw error;
      }
    } else {
      // console.log('Modal not found with any of the tried selectors');
      
      // Log the entire page content for debugging
      const bodyHTML = await page.evaluate(() => document.body.outerHTML);
      // console.log('Full page HTML:', bodyHTML);
  
      throw new Error('Modal dialog not found');
    }
  });

  test('should fill out the form and submit successfully', async ({ page }) => {
    // Wait for the table data to refresh
    // await page.waitForTimeout(500);
    await page.click('button:has-text("New Manual PPO Entry")');
    
    await page.fill('input[formControlName="ppoNo"]', 'PPO-' + Math.floor(Math.random() * (999999 - 100000 + 1) + 100000));
    await page.click('p-dropdown[formControlName="psaCode"]');
    await page.waitForTimeout(500);
    await page.click('li.p-dropdown-item:has-text("AGWB")');
    
    await page.click('p-dropdown[formControlName="ppoType"]');
    await page.waitForTimeout(500);
    await page.click('li.p-dropdown-item:has-text("New PPO")');
    
    await page.click('p-calendar[formControlName="dateOfCommencement"] input');
    await page.click('.p-datepicker-today');
    
    await page.click('p-calendar[formControlName="receiptDate"] input');
    await page.click('.p-datepicker-today');
    
    await page.fill('input[formControlName="mobileNumber"]', '9323232323');
    
    await page.fill('input[formControlName="pensionerName"]', 'Nilakshi Chakraborty');
    
    await page.click('button:has-text("Submit")');
    
    const successMessage = page.locator('text=PPO Receipt added successfully');
    await expect(successMessage).toBeVisible();
  });

  // test('should display error for invalid date of commencement', async ({ page }) => {
  //   // await page.waitForSelector('tbody.p-element.p-datatable-tbody', { state: 'attached', timeout: 10000 });
  //   await page.click('td.ng-star-inserted button:has-text("Edit")'); 
    
  //   await page.click('p-calendar[formControlName="dateOfCommencement"] input');
  //   await page.getByRole('cell', { name: `${new Date().getDate() + 1}` }).nth(1).click();

  //   await page.click('button:has-text("Update")');
  //   const errorMessage = page.locator('text= An error occurred while submitting the form.');
  //   await expect(errorMessage).toBeVisible();
  // });

  // test('should display error for invalid receipt date', async ({ page }) => {
  //   // await page.waitForSelector('tbody.p-element.p-datatable-tbody', { state: 'attached', timeout: 10000 });
  //   await page.click('td.ng-star-inserted button:has-text("Edit")'); 
  //   await page.click('p-calendar[formControlName="receiptDate"] input');
  //   await page.getByRole('cell', { name: `${new Date().getDate() + 1}` }).nth(1).click();
  //   await page.click('button:has-text("Update")');
  //   const errorMessage = page.locator('text= An error occurred while submitting the form.');
  //   await expect(errorMessage).toBeVisible();
  // });


  test('should display error for duplicate PPO number', async ({ page }) => {
    // test.setTimeout(60000); // Increase timeout for this test
  
    await page.click('button:has-text("New Manual PPO Entry")');
    // await page.waitForTimeout(1000);
    const ppoNo = await page.getByText('PPO-').first().innerText();
    await page.fill('input[formControlName="ppoNo"]', ppoNo);
    await page.fill('input[formControlName="pensionerName"]', 'John Pal');
    await page.fill('input[formControlName="mobileNumber"]', '9876541210');
  
    await page.click('p-calendar[formControlName="dateOfCommencement"] input');
    await page.click('.p-datepicker-today');
  
    await page.click('p-calendar[formControlName="receiptDate"] input');
    await page.click('.p-datepicker-today');
  
    await page.click('p-dropdown[formControlName="psaCode"]');
    await page.waitForTimeout(500);
    await page.click('li.p-dropdown-item:has-text("AGWB")');
  
    await page.click('p-dropdown[formControlName="ppoType"]');
    await page.waitForTimeout(500);
    await page.click('li.p-dropdown-item:has-text("New PPO")');
  
    await page.click('button:has-text("Submit")');
  
    const errorMessage = page.locator('small.p-error:has-text("This PPO number already exists. Please use a different PPO number.")');
    await expect(errorMessage).toBeVisible();
  });

  test('should display ui after clicking cancel button', async ({ page }) => {     
    await page.click('button:has-text("New Manual PPO Entry")');     
    await page.click('button:has-text("Cancel")');          
    const newEntryButton = page.locator('button:has-text("New Manual PPO Entry")');
    await expect(newEntryButton).toBeVisible();  
  });

  test('should perform search and update table results', async ({ page }) => {
    // console.log('Starting search functionality test');

    // Wait for the table to be visible
    const tableLocator = page.locator('mh-prime-dynamic-table');
    // await tableLocator.waitFor({ state: 'visible', timeout: 10000 });

    // Find the search input and ensure it's visible
    const searchInput = page.locator('mh-prime-dynamic-table input[placeholder="Search"]');
    await expect(searchInput).toBeVisible();

    // Enter a search term
    const searchTerm = 'DAA2024000001'; // Example search term that is likely to return no results
    await searchInput.fill(searchTerm);

    // Click the search icon button
    const searchIconButton = page.locator('mh-prime-dynamic-table button[icon="pi pi-search"]');
    await searchIconButton.click();

    // Wait for the table to update
    // await tableLocator.waitFor({ state: 'visible', timeout: 20000 });
    
    // Manually count the rows
    const rowSelector = 'tbody.p-element.p-datatable-tbody';
    const rowElements = await page.$$(rowSelector);
    const manualRowCount = rowElements.length;
    // console.log(`row selector: ${rowSelector}, row Elements: ${rowElements.length}`);
    
    // console.log(`Manual row count via Playwright: ${manualRowCount}`);

    if (manualRowCount > 0) {
        // Validate row count and content
        const firstRowText = await rowElements[0].innerText();
        // console.log(`First row content: ${firstRowText}`);
        expect(firstRowText).toContain(searchTerm);
    } else {
        // Check for error message when no rows are found
        const successMessage = page.locator('text=An error occurred');
        await expect(successMessage).toBeVisible();
        // const errorMessageText = await errorMessageLocator.textContent();
        // console.log(`Error message: ${errorMessageText}`);
        // expect(errorMessageText).toContain('An error occurred'); // Or the specific message your application shows
    }

    // Take a screenshot for debugging
    await page.screenshot({ path: DotEnv.NG_APP_PLAYWRIGHT_SCREENSHOT_DIR + '/after_search.png' });
});


test('should load the table with data', async ({ page }) => {
  // console.log('Starting table data loading test');

  // Wait for the table component to be visible
  const table = page.locator('mh-prime-dynamic-table');
  await expect(table).toBeVisible();

  // console.log('Table visibility test completed');
});

  

  

  test('should edit an existing entry', async ({ page }) => {
    // Wait for the table to load
    await page.waitForSelector('tbody.p-element.p-datatable-tbody', { state: 'attached', timeout: 10000 });
    
    // Click the edit button on the first row
    await page.click('td.ng-star-inserted button:has-text("Edit")'); 
    
    // Update some fields
    await page.fill('input[formControlName="pensionerName"]', 'Raj Roy');
    
    // Submit the form
    await page.click('button:has-text("Update")');
    
    // Assert that the success message is displayed
    const successMessage = page.locator('text=PPO Receipt added successfully');
    await expect(successMessage).toBeVisible();
  });

  test('should change table query to display different number of rows', async ({ page }) => {
    // console.log('Starting table query change test');
    
    // Ensure the table is visible
    await page.waitForSelector('mh-prime-dynamic-table', { state: 'visible', timeout: 10000 });

    const rowOptions = [10, 30, 50];

    for (const option of rowOptions) {
        // console.log(`Testing for ${option} rows`);

        // Locate and click the rows per page dropdown trigger
        const dropdownTrigger = page.locator('p-dropdown .p-dropdown-trigger');
        await dropdownTrigger.click();

        // Select the option from the dropdown
        const optionLocator = page.locator(`li[aria-label="${option}"]`);
        await optionLocator.click();

        // Wait for the table data to refresh
        await page.waitForTimeout(2000);

        // Locate the rows in the table
        const rows = page.locator('mh-prime-dynamic-table .p-datatable-row');
        const rowCount = await rows.count();

        // Verify the number of rows displayed
        // console.log(`Number of rows displayed: ${rowCount}`);
        expect(rowCount).toBeLessThanOrEqual(option);

        // Verify the dropdown value
        const selectedValue = await page.locator('p-dropdown .p-dropdown-label').textContent();
        expect(selectedValue?.trim()).toBe(option.toString());

        // console.log(`Verified ${option} rows option`);
    }

    // console.log('Table query change test completed');
});


  // Debugging helper
  test('debug: log HTML and take screenshot', async ({ page }) => {
    await page.waitForTimeout(10000); 
    
    // console.log(await page.evaluate(() => document.body.innerHTML));
    
    await page.screenshot({ path: DotEnv.NG_APP_PLAYWRIGHT_SCREENSHOT_DIR + '/debug-screenshot.png', fullPage: true });
  });
});