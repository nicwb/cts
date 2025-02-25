import { test } from './fixtures';
test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});
test('Is the save button in life certificate page working or not', async ({
    pensionPage,
}) => {
    const data = await pensionPage.savePpoDetails();
    console.log(data);
    const NewData = {
        bank: data.bank,
        branch: data.branch?.split(' - ')[0],
    };
    await pensionPage.lifeCertificate();
    console.log(data);
    await pensionPage.saveData_lifecertificate(NewData, 'save');
});
test('Is the save all button ', async ({ pensionPage }) => {
    const data = await pensionPage.savePpoDetails();
    const NewData = {
        bank: data.bank,
        branch: data.branch?.split(' - ')[0],
    };
    await pensionPage.lifeCertificate();
    await pensionPage.saveData_lifecertificate(NewData, 'saveall');
});
test('Is submitted life certificate button working properly or not', async ({
    pensionPage,
}) => {
    const data = await pensionPage.savePpoDetails();
    const NewData = {
        bank: data.bank,
        branch: data.branch?.split(' - ')[0],
    };
    await pensionPage.lifeCertificate();
    await pensionPage.saveData_lifecertificate(NewData, 'submitted');
});
