# Playwright BDD Framework

A small, reusable BDD framework that runs Cucumber scenarios and automates the browser with Playwright. Cucumber—not the Playwright Test runner—executes the scenarios.

## A. Project architecture

```text
playwright-bdd-framework/
├── features/login.feature             # Gherkin scenarios and tags
├── step-definitions/login.steps.ts    # Gherkin-to-code mappings
├── pages/LoginPage.ts                 # Login Page Object Model
├── hooks/hooks.ts                     # Per-scenario browser lifecycle and screenshots
├── config/config.ts                   # dotenv and typed runtime configuration
├── config/.env.qa                      # QA URL and credentials
├── config/.env.uat                     # UAT URL and credentials
├── test-runner/runner.ts              # Cucumber CLI launcher
├── utils/                              # Place for future shared helpers
├── reports/                            # Generated HTML report
├── screenshots/                        # Screenshots for failed scenarios
├── cucumber.js                         # Cucumber defaults and formatter setup
├── playwright.config.ts               # Browser settings reference (not a test runner)
├── tsconfig.json                       # TypeScript compiler options
└── package.json                        # Dependencies and npm scripts
```

The feature file uses **Gherkin**, a readable Given/When/Then syntax. Step definitions implement those steps and delegate UI work to the **Page Object Model** (`LoginPage`). A Playwright **Browser** process creates a separate **BrowserContext** and **Page** per scenario. Cucumber **hooks** create and clean up those resources and attach screenshots for failures. Cucumber's HTML formatter writes the report to `reports/cucumber-report.html`.

## B. Installation

From the project root:

```bash
npm install
```

## C. Install Playwright browsers

Install Chromium:

```bash
npx playwright install chromium
```

To use the other supported browser types, install them with `npx playwright install firefox` or `npx playwright install webkit`.

## D. Configure environments

Select an environment with `TEST_ENV=qa` or `TEST_ENV=uat`. Edit the matching file under `config/` and set `BASE_URL`, `USERNAME`, and `PASSWORD`. Keep credentials out of source control when using private environments; these demo credentials are provided for SauceDemo. `BROWSER`, `HEADLESS`, and `TIMEOUT_MS` are optional overrides. Set `TEST_USERNAME` and `TEST_PASSWORD` to override the file credentials; `TEST_USERNAME` avoids colliding with Windows' predefined `USERNAME` variable.

PowerShell examples:

```powershell
$env:TEST_ENV = "qa"
npm run test:bdd

$env:TEST_ENV = "uat"
npm run test:bdd
```

## E. Run all BDD tests

```bash
npm run test:bdd
```

All feature files under `features/` are included by default.

## F. Run a specific feature

Direct Cucumber CLI commands load the same TypeScript, hooks, and report configuration:

```bash
npx cucumber-js features/login.feature
```

Or use the runner with a feature path:

```bash
npm run test:bdd -- features/login.feature
```

## G. Run a specific scenario or tag

Tag-filtered execution:

```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "@regression"
```

To run one scenario by its name:

```bash
npx cucumber-js --name "Successful login with valid credentials"
```

## H. Run in headed mode

```bash
npm run test:bdd:headed
```

This sets `HEADLESS=false` for the Cucumber process. You can also set `HEADLESS=false` directly when using the Cucumber CLI.

## I. Generate the HTML report

Both `npm run test:bdd` and `npm run test:bdd:html` generate `reports/cucumber-report.html`. The HTML formatter includes scenario and step statuses, timing, failure details, and attached failure screenshots.

```bash
npm run test:bdd:html
```

## J. Failure screenshots

After a failed scenario, the `After` hook captures a full-page PNG, saves it under `screenshots/`, and attaches its image data to the Cucumber report. Scenario failure is preserved even if screenshot capture itself fails.

## K. End-to-end execution

`runner.ts` starts the Cucumber CLI. Cucumber reads the feature file and matches each Gherkin step to a step definition. The definition calls `LoginPage`, which uses Playwright's `Page` API to interact with the browser. The browser visits SauceDemo, assertions determine the outcome, and Cucumber records step results and attachments in the HTML report. Hooks close each page, context, and browser after its scenario.

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```

## Type-check

```bash
npm run typecheck
```
