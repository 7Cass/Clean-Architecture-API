async function getConfig() {
  const { defineConfig } = await import('vitest/config');
  return defineConfig({
    test: {
      setupFiles: ['./tests/vitest.setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['html', 'json', 'text'],
        include: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
        exclude: ['node_modules', '**/*.test.ts']
      }
    }
  });
}

export default getConfig();