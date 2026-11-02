import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';

// The runner launches Cucumber's CLI (not Playwright Test) and forwards normal Cucumber options.
async function main(): Promise<void> {
  const projectRoot = path.resolve(__dirname, '..');
  const cucumberCli = path.join(projectRoot, 'node_modules', '@cucumber', 'cucumber', 'bin', 'cucumber.js');
  await access(cucumberCli);

  const forwardedArguments: string[] = [];
  for (const argument of process.argv.slice(2)) {
    if (argument === '--headed') {
      process.env.HEADLESS = 'false';
    } else if (argument === '--html') {
      // HTML output is included in cucumber.js for both direct CLI and runner execution.
    } else {
      forwardedArguments.push(argument);
    }
  }

  const child = spawn(process.execPath, [cucumberCli, ...forwardedArguments], {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
  });

  child.once('error', (error) => {
    console.error('Unable to start the Cucumber CLI:', error);
    process.exitCode = 1;
  });
  child.once('exit', (code, signal) => {
    if (code !== null) process.exitCode = code;
    else {
      console.error(`Cucumber exited unexpectedly${signal ? ` after ${signal}` : ''}.`);
      process.exitCode = 1;
    }
  });
}

main().catch((error: unknown) => {
  console.error('BDD test runner failed:', error);
  process.exitCode = 1;
});
