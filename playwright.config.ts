import { config } from './config/config';

// Reference settings for the Playwright browser library. Cucumber hooks consume config/config.ts;
// this project intentionally does not use Playwright Test to execute scenarios.
export default {
  use: {
    baseURL: config.baseUrl,
    browserName: config.browserType,
    headless: config.headless,
  },
  timeout: config.timeoutMs,
};
