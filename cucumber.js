// Cucumber loads this configuration for direct CLI usage and the TypeScript runner.
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['hooks/hooks.ts', 'step-definitions/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: ['progress', 'html:reports/cucumber-report.html'],
  },
};
