import { defineConfig } from "vitest/config";

// Op GitHub Pages staat de site onder https://<user>.github.io/<repo>/,
// dus moet `base` de repo-naam zijn. In CI levert GitHub die aan via
// GITHUB_REPOSITORY ("owner/repo"); lokaal gebruiken we gewoon "/".
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];

export default defineConfig({
  base: repo ? `/${repo}/` : "/",
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
