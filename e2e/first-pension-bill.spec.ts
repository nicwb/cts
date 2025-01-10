import { test } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test.skip('can generate first pension bill and save', async ({
    pensionPage,
}) => {
    await pensionPage.savePpoDetailsApproveGenerateFirstPensionBill();
});
