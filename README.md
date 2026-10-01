# LocalEstate Playwright Tests

[![Playwright Tests](https://github.com/VedantVivek/localestate-playwright-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/VedantVivek/localestate-playwright-tests/actions/workflows/playwright.yml)

End-to-end UI and API test automation for [LocalEstate](https://github.com/VedantVivek/localEstate), a full-stack real-estate app built with Express and MongoDB and deployed on Vercel ([live demo](https://local-estate-main.vercel.app)).

Built with **Playwright + TypeScript**, running on every push through **GitHub Actions**.

## What's covered

| Area | What the tests check | Tests |
|---|---|---|
| Health API | Service and database are up, core features are enabled | 2 |
| Properties API | List is returned, every property has its core fields, ids are unique | 3 |
| Mortgage API | Correct monthly payment, default values, invalid and missing input is rejected | 8 |
| Auth API | Wrong password and unknown email give the same error, protected routes need a valid token, full sign-in → profile → sign-out lifecycle | 5 |
| Home page (UI) | Page loads with the right title | 1 |
| Property board (UI) | Listing count is shown, city search narrows results, empty search shows a clear message | 3 |
| Sign in (UI) | Wrong password shows an error, demo account signs in | 2 |

**24 tests in total**, tagged `@smoke`, `@regression` or `@known-bug`.

## Bugs found

- **0% down payment is ignored.** The API uses `Number(down) || 20`, and since `0` is falsy in JavaScript, a 0% down payment silently becomes 20%.
- **0% interest rate is ignored.** Same pattern with `Number(rate) || 6.5`, which also makes the zero-rate branch of the formula unreachable.
- **Stale production URL.** While setting up the suite, the old live URL returned Vercel's `DEPLOYMENT_NOT_FOUND`. The links were moved to the working deployment.

The first two are kept as `@known-bug` tests using `test.fail()`. They document the current behaviour and will flag automatically once the bugs are fixed.

## Test design

- **Page Object Model** for UI tests (`pages/`), so selectors live in one place.
- **Custom fixtures** (`fixtures/pages.ts`) inject page objects into tests.
- **Shared test data** (`test-data/`), with credentials overridable through environment variables.
- **Network-aware waits.** The backend is serverless and can be slow on a cold start, so UI tests wait for the actual API response instead of fixed delays. Stability was checked with `--repeat-each`.
- **Safe against production.** Tests that run on the live site only read data or clean up after themselves (sign-in is followed by sign-out). Flows that create data, like registration, tours and reviews, are planned for a local environment.
- **Minimal side effects.** A successful sign-in sends emails in this app, so the suite keeps real sign-ins to a minimum.

## Running the tests

```bash
npm ci
npx playwright install --with-deps chromium
npx playwright test
```

Useful variations:

```bash
npx playwright test --grep @smoke                              # quick smoke run
BASE_URL=http://localhost:3000 npx playwright test             # run against a local instance
npx playwright show-report                                     # open the HTML report
```

## CI

GitHub Actions runs the suite on every push and pull request to `main`, and can be triggered manually. It installs only Chromium, which cut the pipeline from about 16 minutes to under 3 minutes. The HTML report is uploaded as a build artifact, and traces and screenshots are kept for failed tests.

## Project structure

```
├── .github/workflows/playwright.yml   # CI pipeline
├── fixtures/pages.ts                  # custom fixtures
├── pages/                             # page objects
├── test-data/                         # shared test data
├── tests/
│   ├── api/                           # API tests
│   └── ui/                            # UI tests
└── playwright.config.ts
```

## Next steps

- Docker setup to run the app and MongoDB locally, for tests that create data
- Allure report published to GitHub Pages
- API schema validation
- UI test for the mortgage calculator