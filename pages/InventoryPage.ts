import { Locator, Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  
  // High-level Containers
  readonly inventoryList: Locator;
  readonly allInventoryItems: Locator;
  
  // Shopping Cart Badge
  readonly shoppingCartBadge: Locator;
  
  // Sorting Dropdown
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Top level structures
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.allInventoryItems = page.locator('[data-test="inventory-item"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  // to get single product card by its name
  getProductCard(productName: string): Locator {
    return this.allInventoryItems.filter({ hasText: productName });
  }

  // Adds an item to the cart dynamically using its name
  async addItemToCart(productName: string) {
    const productCard = this.getProductCard(productName);
    // Finds the button within that specific product card
    await productCard.locator('button:has-text("Add to cart")').click();
  }

  // Removes an item from the cart dynamically using its name
  async removeItemFromCart(productName: string) {
    const productCard = this.getProductCard(productName);
    await productCard.locator('button:has-text("Remove")').click();
  }

  // Click the title of a product to navigate to details view
  async clickProductTitle(productName: string) {
    const productCard = this.getProductCard(productName);
    await productCard.locator('[data-test^="item-"][data-test$="-title-link"]').click();
  }

  // Sorts the inventory grid
  async sortProductsBy(value: "az" | "za" | "lohi" | "hilo") {
    await this.sortDropdown.selectOption(value);
  }

  // Collects all product names from the screen to evaluate sorting order
  async getAllProductNames(): Promise<string[]> {
    return await this.page.locator('[data-test="inventory-item-name"]').allInnerTexts();
  }
}