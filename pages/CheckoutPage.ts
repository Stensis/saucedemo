import { Locator, Page } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;

  // Form fields
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;

  // Buttons
  readonly continueBtn: Locator;
  readonly cancelBtn: Locator;
  readonly finishBtn: Locator;

  // Error Container
  readonly errorMessage: Locator;

  readonly summaryItemTotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryGrandTotal: Locator;

  readonly completeHeader: Locator;
  readonly completeText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Mapping fields using SauceDemo data-test attributes
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');

    this.continueBtn = page.locator('[data-test="continue"]');
    this.cancelBtn = page.locator('[data-test="cancel"]');
    this.finishBtn = page.locator('[data-test="finish"]');

    this.errorMessage = page.locator('[data-test="error"]');

    this.summaryItemTotal = page.locator('[data-test="subtotal-label"]');
    this.summaryTax = page.locator('[data-test="tax-label"]');
    this.summaryGrandTotal = page.locator('[data-test="total-label"]');

    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
  }

  // Action: Fills the entire form in one clean method
  async fillCheckoutForm(fName: string, lName: string, pCode: string) {
    await this.firstNameInput.fill(fName);
    await this.lastNameInput.fill(lName);
    await this.postalCodeInput.fill(pCode);
  }

  // Action: Clicks continue
  async clickContinue() {
    await this.continueBtn.click();
  }

  async clickCancel() {
    await this.cancelBtn.click();
  }

  async clickFinish() {
    await this.finishBtn.click();
  }
}
