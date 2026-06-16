import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { readData } from "../utils/dataReader";
import { URLS } from "../constants/url";

const testData = readData("./test-data/LoginData.json");

test.describe("Login Tests", () => {
  for (const data of testData) {
    test(`[${data.category}] - ${data.scenario}`, async ({ page }) => {
      test.skip(data.run !== "yes", "Run flag is not set to yes");

      const loginPage = new LoginPage(page);

      await test.step("Go to login page", async () => {
        await loginPage.gotoLoginPage();
      });

      await test.step("Perform Login", async () => {
        if (data.isDelayed) {
          test.setTimeout(20000);
        }
        await loginPage.login(data.username, data.password);
      });

      await test.step("Validate Result", async () => {
        if (data.expected === "success") {
          await expect(page).toHaveURL(URLS.inventory);
        } else {
          await expect(loginPage.errorMessage).toBeVisible();
          if (data.errorMessageText) {
            await expect(loginPage.errorMessage).toHaveText(data.errorMessageText);
          }
        }
      });
    });
  }
});