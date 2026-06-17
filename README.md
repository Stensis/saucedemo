# SauceDemo E2E Automation Framework

A production-ready, highly scalable, and data-driven End-to-End (E2E) automation testing framework built using **Playwright** and **TypeScript**. This project implements advanced automation design patterns to test authentication, user persona variations, shopping carts, and financial checkouts on the SauceDemo application.

---

## 🚀 Key Framework Features

* **Page Object Model (POM):** Complete decoupling of test scripts from the underlying HTML/DOM structure using specialized page classes, maximizing script maintainability.
* **Data-Driven Testing (DDT):** Test execution flows are completely separated from test data payloads, utilizing parameterized JSON structures to scale negative and positive test scenarios effortlessly.
* **Human-Centric Scenario Modeling:** Test scenarios are contextualized through a "humane" lens (e.g., mimicking real user behaviors like forgetting inputs or experiencing latency) rather than using rigid, clinical database descriptions.
* **Parallel Execution Cross-Browser Capability:** Configured natively to execute asynchronously across multiple workers utilizing Chromium, Firefox, WebKit, and Mobile viewport emulation layouts.
* **Dynamic Resilience to System Latency:** Leverages adaptive programmatic timeouts to elegantly process deliberate application lag (such as the 5-second API delay on special user profiles) preventing brittle or flaky pipeline states.
* **Secure Environment Architecture:** Isolated credential management layer engineered to consume variables via system environment contexts, mitigating the risks of hardcoding static credentials into code repositories.

---

## 🛠️ Framework Architecture & Project Structure

The project strictly follows the principle of **Separation of Concerns**:

```text
saucedemo_testing/
├── .github/               # CI/CD Workflows (GitHub Actions configuration)
├── constants/             # Centralized application constants (URLs, app text strings)
├── pages/                 # Page Object Models (POM Layer)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts    # Handlers for inputs, cancellations, and order completion
├── test-data/             # Dynamic test matrices (Data Layer)
│   ├── LoginData.json
│   ├── InventoryData.json
│   └── CheckoutData.json  # Multi-tiered validation and math tracking payloads
├── tests/                 # Execution scripts (Assertion & Step Layer)
│   ├── login.spec.ts
│   ├── inventory.spec.ts
│   └── checkout.spec.ts   # Conditional multi-branch structural test runners
├── utils/                 # Extensible File System parsers (CSV, Excel, JSON)
│   └── dataReader.ts
├── .env                  # Local secret configuration (Git ignored)
├── .gitignore            # Security filter for system modules/credentials
├── playwright.config.ts  # Master orchestration runner configurations
└── package.json          # Node dependency tracking manifest
```
---

##  🧪 Test Coverage Scenarios

**1. Authentication Matrix (tests/login.spec.ts)
Happy Path Execution: Access verification utilizing standard accounts.**

* **Account Restrictions:** Capturing system-level lockdown blocks (locked_out_user).

* **Edge-Case Profiling:** Handling specialized UI anomalies and systemic breaks (visual_user, error_user).

* **Input Validation Checkpoints:** Ensuring appropriate messaging flags are raised when fields are left partially empty, entirely empty, or are provided with syntax typos.

**2. Catalog & Grid Management (tests/inventory.spec.ts)
UI Integrity Scans: Confirming total item loading densities across all target devices.**

* **Navigation Triggers:** Verifying click pathways safely forward parameters into dedicated element details states.

* **Dynamic State Tracking:** Comprehensive validations verifying shopping cart badge state shifts during batch "Add" operations and complete component collapse upon item "Removal" steps.

* **Algorithmic Array Sorting:** Robust functional evaluation confirming both multi-tiered string alphabetic layouts (A-Z, Z-A) and numeric floating-point pricing parameters (Low-High, High-Low) correctly map to system expectations.

**3. Shopping Cart & Checkout Flow (tests/checkout.spec.ts)
Cart Details Integrity: Verification that item rows preserve exact names, prices, and quantities dynamically across state switches without requiring browser reloads.**

* **Form Submission Validations:** Boundary tests targeting the data collection gateway. Asserts that missing mandatory fields (First Name, Last Name, Zip/Postal Code) trigger accurate error logs.

* **Financial Calculations Check:** High-precision script scans validating that Item Totals, Tax percentages, and Grand Totals are mathematically consistent with selected items.

* **Navigational Safeguards:** Evaluation of routing mechanisms to confirm that interrupting an active process via the "Cancel" option gracefully rolls back state and safely restores the application interface to the inventory catalog.

* **End-to-End Order Processing:** Full checkout lifecycles verifying successful final page redirections alongside confirmation headers and text blocks.

---
## ⚙️ Setup and Installation Instructions.
* **Prerequisites**
Ensure that Node.js (v18 or higher) is installed on your local operating environment.

1. Clone the Repository
```
git clone https://git@github.com:Stensis/saucedemo.git
```
```
cd saucedemo_testing
```
2. Install Project Dependencies
```
npm install
```
3. Initialize Playwright Browser Environments
```
npx playwright install
```
4. Create and Configure Local Environment Variables

Generate a .env file in the root structure of your directory to abstract your secrets securely:

```
touch .env
```
Inside the .env file, populate the following properties:
```
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
```
---

## 🏃 Running the Automation Suites
Execute your scripts using the unified command line runner:

Run All Test Files Across All Browsers (Headless)
```
npx playwright test
```
Run a Specific Specification Suite (e.g., Checkout)
```
npx playwright test tests/checkout.spec.ts
```
Run Tests in UI Interactive Debugging Mode
```
npx playwright test --ui
```
Review Interactive Automation Metrics Reports
```
npx playwright show-report
```
---

## 🏆 Key Architectural Patterns Demonstrated
* **Code-Level Scoping Optimization**
To systematically address Playwright's strict multiplicity locator flags on repeating user interfaces (like grid product containers), the code avoids indexing arrays by absolute values. Instead, it relies on advanced sub-filtering logic parameters (hasText), programmatically scoping page interactions safely down to specific card nodes without establishing fragile hard-dependencies:

```
getProductCard(productName: string): Locator {
  return this.allInventoryItems.filter({ hasText: productName });
}
```

* **Dynamic File Resolution Insulation**
The framework is completely isolated from execution environment anomalies. By leveraging runtime folder paths paired with structural absolute system converters (path.resolve(process.cwd(), filePath)), test execution runs uniformly whether triggered manually at the localized root directory or programmatically through cloud cluster containers.