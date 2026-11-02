import dotenv from 'dotenv';
import path from 'node:path';

const testEnvironment = process.env.TEST_ENV ?? 'qa';
if (!['qa', 'uat'].includes(testEnvironment)) {
  throw new Error(`Unsupported TEST_ENV "${testEnvironment}". Choose "qa" or "uat".`);
}

const environmentPath = path.resolve(process.cwd(), 'config', `.env.${testEnvironment}`);
const environmentResult = dotenv.config({ path: environmentPath });
if (environmentResult.error) {
  throw new Error(`Unable to load environment file "${environmentPath}": ${environmentResult.error.message}`);
}
const fileEnvironment = environmentResult.parsed ?? {};

type BrowserType = 'chromium' | 'firefox' | 'webkit';
function isBrowserType(value: string): value is BrowserType {
  return value === 'chromium' || value === 'firefox' || value === 'webkit';
}

const browserType = process.env.BROWSER ?? 'chromium';
if (!isBrowserType(browserType)) {
  throw new Error(`Unsupported BROWSER "${browserType}". Choose chromium, firefox, or webkit.`);
}

function readBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  throw new Error(`Expected a boolean environment value, received "${value}".`);
}

function readPositiveNumber(value: string | undefined, defaultValue: number): number {
  if (value === undefined) return defaultValue;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new Error(`Expected a positive number, received "${value}".`);
  }
  return numberValue;
}

const baseUrl = process.env.BASE_URL ?? fileEnvironment.BASE_URL;
// USERNAME is predefined on Windows, so TEST_USERNAME is the unambiguous runtime override.
const username = process.env.TEST_USERNAME ?? fileEnvironment.USERNAME ?? process.env.USERNAME;
const password = process.env.TEST_PASSWORD ?? process.env.PASSWORD ?? fileEnvironment.PASSWORD;
if (!baseUrl || !username || !password) {
  throw new Error(`BASE_URL, USERNAME, and PASSWORD must be set in ${environmentPath}.`);
}

export const config = {
  baseUrl,
  username,
  password,
  browserType,
  headless: readBoolean(process.env.HEADLESS, true),
  timeoutMs: readPositiveNumber(process.env.TIMEOUT_MS, 30_000),
};
