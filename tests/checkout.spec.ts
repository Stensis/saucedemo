import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { URLS } from "../constants/url";
import { readData } from "../utils/dataReader";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

const checkoutData = readData("./test-data/CheckoutData.json");

test.describe("Cart & Checkout Flows", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.login(
      process.env.SAUCE_USERNAME || "standard_user",
      process.env.SAUCE_PASSWORD || "secret_sauce",
    );
  });

  for (const data of checkoutData) {
    test(`[${data.category}] - ${data.scenario}`, async ({ page }) => {
      test.skip(data.run !== "yes", "skipping non active tests");

      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);
      const checkoutPage = new CheckoutPage(page);

      // CART DETAILS VERIFICATION
      if (data.category === "Cart Details - Verification") {
        await test.step("Add multiple items to cart from Inventory", async () => {
          for (const item of data.itemsToVerify) {
            await inventoryPage.addItemToCart(item.name);
          }
          //Navigate to the cart page
          await page.goto("/cart.html");
        });

        await test.step("Verify prices and quantities without a reload", async () => {
          for (const item of data.itemsToVerify) {
            const itemRow = cartPage.getCartItemRow(item.name);
            await expect(itemRow).toBeVisible();

            const uiPrice = await cartPage.getItemPriceInCart(item.name);
            const uiQuantity = await cartPage.getItemQuantityInCart(item.name);

            expect(uiPrice).toBe(item.price);
            expect(uiQuantity).toBe(item.quantity);
          }
        });
      }

      // Checkout form validation
      if (data.category === "Checkout Form - Validation") {
        await test.step("Navigate past cart to checkout information form", async () => {
          await page.goto("/cart.html");
          await cartPage.proceedToCheckout();
        });
        await test.step("Fill form fields and assert missing mandatory fields block submission", async () => {
          await checkoutPage.fillCheckoutForm(
            data.firstName,
            data.lastName,
            data.postalCode,
          );
          await checkoutPage.clickContinue();

          await expect(checkoutPage.errorMessage).toBeVisible();
          await expect(checkoutPage.errorMessage).toHaveText(
            data.expectedError,
          );
        });
      }

      // SUMMARY FINANCIAL CALCULATIONS
      if (data.category === "Checkout Summary - Financial Calculations") {
        await test.step("Add target items and navigate to Summary page", async () => {
          for (const itemName of data.itemsToPurchase) {
            await inventoryPage.addItemToCart(itemName);
          }

          await page.goto("/cart.html");
          await cartPage.proceedToCheckout();

          await checkoutPage.fillCheckoutForm(
            data.firstName,
            data.lastName,
            data.postalCode,
          );
          await checkoutPage.clickContinue();
        });

        await test.step("Verify math summary statements match calculations", async () => {
          await expect(checkoutPage.summaryItemTotal).toHaveText(
            data.expectedItemTotal,
          );
          await expect(checkoutPage.summaryTax).toHaveText(data.expectedTax);
          await expect(checkoutPage.summaryGrandTotal).toHaveText(
            data.expectedTotal,
          );
        });
      }

      // NAVIGATIONAL BUTTONS & COMPLETE WORKFLOW
      if (
        data.category === "Checkout Flow - Navigational Safeguards" ||
        data.category === "Checkout Flow - Complete Order E2E"
      ) {
        await test.step("Add items and navigate to checkout information form", async () => {
          for (const itemName of data.itemsToPurchase) {
            await inventoryPage.addItemToCart(itemName);
          }
          await page.goto("/cart.html");
          await cartPage.proceedToCheckout();
        });

        await test.step("Process form and handle conditional final actions", async () => {
          await checkoutPage.fillCheckoutForm(
            data.firstName || "Cancel",
            data.lastName || "Tester",
            data.postalCode || "00000",
          );
          await checkoutPage.clickContinue();

          if (data.actionToPerform === "cancel") {
            await checkoutPage.clickCancel();

            await expect(page).toHaveURL(new RegExp(data.expectedUrlSnippet));
          } else {
            await checkoutPage.clickFinish();

            await expect(page).toHaveURL(new RegExp("/checkout-complete.html"));
            await expect(checkoutPage.completeHeader).toHaveText(
              data.expectedHeader,
            );
            await expect(checkoutPage.completeText).toHaveText(
              data.expectedText,
            );
          }
        });
      }
    });
  }
});
