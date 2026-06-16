import { test, expect } from "@playwright/test";
import { readData } from "../utils/dataReader";
import { InventoryPage } from "../pages/InventoryPage";
import { LoginPage } from "../pages/LoginPage";
import { URLS } from "../constants/url";

const testData = readData("./test-data/InventoryData.json");

test.describe("Inventory Tests", () => {
  // Every single inventory test case requires being authenticated first
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    const username = process.env.SAUCE_USERNAME || "standard_user";
    const password = process.env.SAUCE_PASSWORD || "secret_sauce";

    await loginPage.gotoLoginPage();
    await loginPage.login(username, password);
    await expect(page).toHaveURL(URLS.inventory);
  });

  for (const data of testData) {
    test(`[${data.category}] - ${data.scenario}`, async ({ page }) => {
      test.skip(data.run !== "yes", "Run flag is not set to yes");

      const inventoryPage = new InventoryPage(page);

      // 1. Handle Grid Counting Scenarios
      if (data.expectedItemCount) {
        await test.step("Verify total product count on grid", async () => {
          await expect(inventoryPage.allInventoryItems).toHaveCount(
            data.expectedItemCount,
          );
        });
      }

      // 2. Handle Product Detail Click Scenarios
      if (data.itemToClick) {
        await test.step(`Click product title: ${data.itemToClick}`, async () => {
          await inventoryPage.clickProductTitle(data.itemToClick);
          await expect(page).toHaveURL(data.expectedUrlSnippet);
        });
      }

      // 3. Handle Add to Cart Scenarios (Handles 1 or many items cleanly)
      if (data.itemsToAdd && data.itemsToAdd.length > 0) {
        await test.step("Add items to cart", async () => {
          for (const item of data.itemsToAdd) {
            await inventoryPage.addItemToCart(item);
          }
        });
      }

      // 4. Handle Remove from Cart Scenarios
      if (data.itemsToRemove && data.itemsToRemove.length > 0) {
        await test.step("Remove items from cart", async () => {
          for (const item of data.itemsToRemove) {
            await inventoryPage.removeItemFromCart(item);
          }
        });
      }
      // 5. Handle Cart Badge Counter Assertions
      if (data.expectedBadgeCount) {
        await test.step(`Verify cart badge status displays: ${data.expectedBadgeCount}`, async () => {
          if (data.expectedBadgeCount === "hidden") {
            await expect(inventoryPage.shoppingCartBadge).toBeHidden();
          } else {
            await expect(inventoryPage.shoppingCartBadge).toHaveText(
              data.expectedBadgeCount,
            );
          }
        });
      }
      // 6. Handle Sorting Validation Scenarios
      if (data.sortOption) {
        await test.step(`Sort products by: ${data.sortOption}`, async () => {
          await inventoryPage.sortProductsBy(data.sortOption);

          const actualProductNames = await inventoryPage.getAllProductNames();

          // Verify that the first and last displayed items match our expectation parameters
          expect(actualProductNames[0]).toBe(data.expectedFirstItem);
          expect(actualProductNames[actualProductNames.length - 1]).toBe(
            data.expectedLastItem,
          );
        });
      }
    });
  }
});
