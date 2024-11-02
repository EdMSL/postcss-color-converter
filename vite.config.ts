import { defineConfig } from 'vitest/config';

export default defineConfig({
  appType: 'custom',
  root: __dirname,
  test: {
    include: ['test/*.test.js', 'test/**/*.test.js'],
    setupFiles: ['test/setup.js'],
    clearMocks: true,

    reporters: ['default', 'junit'],
    outputFile: {
      junit: './junit-report.xml',
      html: './json-report.html',
    },

    coverage: {
      provider: 'istanbul',
      enabled: true,
      reporter: ['clover', 'text', 'html', 'lcov', 'lcovonly'],
      reportsDirectory: '.reports',
      include: ['src'],
    },
    testTimeout: 20000,
    // node14 segfaults often with threads
    threads: !process.versions.node.startsWith('14'),
  },
});
