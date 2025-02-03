import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    include: [
        "**/__test__/**/*.test.{ts,tsx}",
        "src/__tests__/**/*.test.{ts,tsx}",
    ],
    exclude: ['node_modules', 'dist'], 
    globals: true
  },
});
