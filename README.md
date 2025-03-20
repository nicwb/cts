### IFMS-CTS Pension Project

[![Playwright Tests for Angular CI](https://github.com/nicwb/cts/actions/workflows/playwright.yml/badge.svg)](https://github.com/nicwb/cts/actions/workflows/playwright.yml)

Copy one of the following `.env.playwright`, `.env.playwright.docker` or `.env.uat` as per your workspace requirement to `.env` file in the same place and change the values according to your need.

#### Run Playwright Tests in docker

Use the following command to run playwright tests in docker

```sh
docker-compose exec angular-test xvfb-run npx playwright test --reporter=list --headed --project=chromium
```