// Environment file for development builds.
// 1) This file is bundled when you run `ng serve` or `ng build` without the `--configuration production` flag.
// 2) Put non-sensitive, frontend-safe configuration here (will be visible in the browser bundle).
// 3) For production, the build will replace this file with `environment.prod.ts` via angular.json fileReplacements.

export const environment = {
  production: false,
  // Base URL of your API for local/dev. Remove trailing slash OR handle it in code.
  // Tip: avoid secrets in frontend code; use server-side or runtime config for secrets.
  apiBaseUrl: 'http://localhost:8000/api/syllables/split-syllables/'
};
