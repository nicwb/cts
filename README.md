### IFMS-CTS Project 

[![Playwright Tests for Angular CI](https://github.com/nicwb/cts/actions/workflows/playwright.yml/badge.svg)](https://github.com/nicwb/cts/actions/workflows/playwright.yml)

Create `.env` file in the project root and add the following and change the values according to your need.

```sh
NG_APP_BASE_URL=http://docker.test
NG_APP_API_BASE_URL=http://api.docker.test
NG_APP_PLAYWRIGHT_BASE_URL=http://localhost:4200
NG_APP_PLAYWRIGHT_SCREENSHOT_DIR=e2e/screenshots
NG_APP_ENV_DOCKER=
```