import { test } from "./fixtures";

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('can generate first pension bill and save', async ({ pensionPage,}) => {
    await pensionPage.savePpoDetailsApproveGenerateFirstPensionBill();
});
