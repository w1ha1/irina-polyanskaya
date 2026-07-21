import { fileURLToPath } from 'node:url';
import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    // Playwright's e2e/*.spec.ts files match Vitest's default *.spec.ts glob but
    // import @playwright/test, whose test() throws when invoked outside Playwright's
    // own runner. Exclude the e2e directory so the two suites stay separate.
    //
    // .claude/ can contain a nested Claude Code worktree checkout (its own full
    // source tree + node_modules) when development happens in one; Vitest's globs
    // don't respect .gitignore, so without this it double-discovers every test file
    // against a second, potentially out-of-sync node_modules and fails spuriously.
    exclude: [...configDefaults.exclude, 'e2e/**', '.claude/**'],
  },
});
