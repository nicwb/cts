import { test, expect } from "@playwright/test";

test.describe('First pension bill', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if (isMobile) {
            page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        // Navigate to the page containing your component
        await page.goto('/#/pension/modules/pension-process/pension-bill');
    });
    test('Input button or button visible or not', async ({ page }) => {
        await expect(page.getByPlaceholder('PPO ID')).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Select a date' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Generate' })).toBeDisabled();
    });

    test('First bill generate', async ({ page }) => {
        // Intercept the request and wait for the response that matches your API endpoint
        const today = new Date();
        const day = today.getDate().toString(); // Extract the day as a string

        const [response] = await Promise.all([
            page.waitForResponse(response =>
                response.url().includes('/api/v1/ppo/first-bill-generate') // Your exact API endpoint
            ),
            await page.locator('p-button').getByRole('button').click(),
            await expect(page.locator('div').filter({ hasText: /^Search$/ })).toBeVisible(),
            // getByRole('cell', { name: '7', exact: true })
            await page.locator('div').filter({ hasText: /^Search$/ }).waitFor(),
            await page.locator('role=cell').filter({ hasText: /\d+/ }).first().click(),

            // await page.getByRole('cell', { name: '2', exact: true }).click(),
            await page.getByRole('textbox', { name: 'Select a date' }).click(),
            // Find the element that matches today's date and click it
            await page.locator(`text="${day}"`).click(),
            await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible(),
            await page.getByRole('button', { name: 'Generate' }).click(),
        ]);

        // Assert the HTTP status code
        expect(response.status()).toBe(200);

        // Extract the response body and validate the apiResponseStatus
        const responseBody = await response.json();

        // Check if the `apiResponseStatus` is 1
        if(responseBody.apiResponseStatus === 1){
        expect(responseBody.apiResponseStatus).toBe(1);
        await expect(page.getByLabel('Success')).toBeVisible();
        }else if(responseBody.apiResponseStatus === 3){
            expect(responseBody.apiResponseStatus).toBe(3);
            await expect(page.getByLabel('Oops...')).toBeVisible();
        }
        // Optional: Log the response body for debugging purposes
    });

    test('First bill save', async ({ page }) => {
        // Intercept the request and wait for the response that matches your API endpoint
        const today = new Date();
        const day = today.getDate().toString(); // Extract the day as a string

        const [response] = await Promise.all([
            page.waitForResponse(response =>
                response.url().includes('/api/v1/ppo/first-bill-generate') // Your exact API endpoint
            ),
            await page.locator('p-button').getByRole('button').click(),
            await expect(page.locator('div').filter({ hasText: /^Search$/ })).toBeVisible(),
            // getByRole('cell', { name: '7', exact: true })
            await page.locator('div').filter({ hasText: /^Search$/ }).waitFor(),
            await page.locator('role=cell').filter({ hasText: /\d+/ }).first().click(),

            // await page.getByRole('cell', { name: '2', exact: true }).click(),
            await page.getByRole('textbox', { name: 'Select a date' }).click(),
            // Find the element that matches today's date and click it
            await page.locator(`text="${day}"`).click(),
            await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible(),
            await page.getByRole('button', { name: 'Generate' }).click(),

        ]);

        // Assert the HTTP status code
        expect(response.status()).toBe(200);

        // Extract the response body and validate the apiResponseStatus
        const responseBody = await response.json();
        if (responseBody.apiResponseStatus === 1) {
            expect(responseBody.apiResponseStatus).toBe(1);
            // Proceed to the next request if apiResponseStatus is 1
            const [result] = await Promise.all([
                page.waitForResponse(response =>
                    response.url().includes('/api/v1/ppo/first-bill') // Your next API endpoint
                ),
                // Click the Save button (ensure it's a proper action, not an expectation)
                page.getByRole('button', { name: ' Save' }).click(),
            ]);

            // Assert the HTTP status code of the next response
            expect(result.status()).toBe(200);
            // Log the result response body if needed
            const resultBody = await result.json();
            if (resultBody.apiResponseStatus === 1) {
                expect(resultBody.apiResponseStatus).toBe(1);
                await expect(page.getByLabel('Success')).toBeVisible();
            } else if (responseBody.apiResponseStatus === 3) {
                expect(resultBody.apiResponseStatus).toBe(3);
                await expect(page.getByLabel('Are you sure?')).toBeVisible();
            }
            // Additional validations or operations based on the result can go here
        } else {
            console.log('API response status is not 1');
        }
    });

    test('Check valid ppoid or not', async ({ page }) => {
        // Generate a dynamic PPO ID
        const dynamicPpoId = Math.floor(Math.random() * 90000) + 10000;

        // Log the dynamic PPO ID for debugging purposes
        console.log(`Testing with PPO ID: ${dynamicPpoId}`);

        // Intercept the request and wait for the response that matches your API endpoint
        const [apiResponse] = await Promise.all([
            // Use backticks and string interpolation to insert dynamicPpoId into the URL
            page.waitForResponse(response =>
                response.url().includes(`/api/v1/ppo/${dynamicPpoId}/details`)
            ),
            // Trigger the actions that will cause the API call
            page.getByPlaceholder('PPO ID').click(),
            page.getByPlaceholder('PPO ID').fill(dynamicPpoId.toString()),
            page.getByRole('textbox', { name: 'Select a date' }).click(),
        ]);

        // Extract the response body
        const resBody = await apiResponse.json();

        // Check the apiResponseStatus and validate the response
        if (resBody.apiResponseStatus === 1) {
            expect(resBody.apiResponseStatus).toBe(1);
            console.log('PPO ID is valid.');
        } else if (resBody.apiResponseStatus === 3) {
            expect(resBody.apiResponseStatus).toBe(3);
            // Ensure the "Invalid ppoId!" message is visible when status is 3
            await expect(page.getByText('Invalid ppoId!')).toBeVisible();
            console.log('PPO ID is invalid.');
        } else {
            // Optional: Handle other unexpected status codes if necessary
            console.error(`Unexpected status code: ${resBody.apiResponseStatus}`);
        }
    });

    test('Bill print', async ({ page }) => {
        // Click the print button
        await page.getByRole('button', { name: ' Print' }).click();
    
        // Navigate to the correct URL, making sure to await the page.goto
        await page.goto('/#/pension/modules/pension-process/bill-print/first-pension');
    
        // Validate that the expected text is visible on the page
        await expect(page.getByText('General BillClassification BillPPO Bill PPO ID: Generate Report Refresh')).toBeVisible();
    });


});