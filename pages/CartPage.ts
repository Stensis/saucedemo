import { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly cartContainer: Locator;
  readonly allCartItems: Locator;
  readonly checkOutBtn: Locator;
  readonly continueShoppingBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartContainer = page.locator('[data-test="cart-contents-container"]');
    this.allCartItems = page.locator('[data-test="inventory-item"]');
    this.checkOutBtn = page.locator('[data-test="checkout"]');
    this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
  }

  // Gets a single row in the cart by passing its item title text
  getCartItemRow(productName: string): Locator {
    return this.allCartItems.filter({ hasText: productName });
  }
  // to go to checkout
  async proceedToCheckout() {
    await this.checkOutBtn.click();
  }
  // to go back to shopping
  async clickContinueToShopping() {
    await this.continueShoppingBtn.click();
  }

  //   =====verification helpers====
  // Grabs the price text inside a specific item row
  async getItemPriceInCart(productName: string): Promise<string> {
    const itemRow = this.getCartItemRow(productName);
    return await itemRow
      .locator('[data-test="inventory-item-price"]')
      .innerText();
  }
  // Grabs the quantity text inside a specific item row
  async getItemQuantityInCart(productName: string): Promise<string> {
    const itemRow = this.getCartItemRow(productName);
    return await itemRow.locator('[data-test="item-quantity"]').innerText();
  }
}
