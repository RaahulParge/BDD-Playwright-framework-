import {
  After,
  Before,
  setDefaultTimeout,
  Status,
  World,
  setWorldConstructor,
} from '@cucumber/cucumber';
import type { IWorldOptions } from '@cucumber/cucumber';
import { chromium, firefox, webkit, type Browser, type BrowserContext, type Page } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config/config';
import { LoginPage } from '../pages/LoginPage';

// A Browser is the launched browser process; each scenario gets an isolated BrowserContext and Page.
export class LoginWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  loginPage!: LoginPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(LoginWorld);
setDefaultTimeout(config.timeoutMs);

Before(async function (this: LoginWorld) {
  const browserTypes = { chromium, firefox, webkit };
  this.browser = await browserTypes[config.browserType].launch({
    headless: config.headless,
  });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
});

After(async function (this: LoginWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    try {
      const image = await this.page.screenshot({ fullPage: true });
      const screenshotsDirectory = path.resolve(process.cwd(), 'screenshots');
      await mkdir(screenshotsDirectory, { recursive: true });
      const safeScenarioName = scenario.pickle.name.replace(/[^a-z0-9-_]/gi, '_');
      const screenshotPath = path.join(
        screenshotsDirectory,
        `${safeScenarioName}-${Date.now()}.png`
      );
      await writeFile(screenshotPath, image);
      this.attach(image, 'image/png');
      console.info(`Failure screenshot saved to ${screenshotPath}`);
    } catch (error) {
      console.error('Unable to capture or attach the failure screenshot:', error);
    }
  }

  const resources: Array<Browser | BrowserContext | Page> = [];
  if (this.page) resources.push(this.page);
  if (this.context) resources.push(this.context);
  if (this.browser) resources.push(this.browser);

  for (const resource of resources) {
    try {
      await resource.close();
    } catch (error) {
      console.error('Unable to close a Playwright resource:', error);
    }
  }
});
