import { test} from "./fixtures";

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test("Save PPO details", async ({ pensionPage}) => {
    // Arrange
    await pensionPage.savePpoDetails();
});
