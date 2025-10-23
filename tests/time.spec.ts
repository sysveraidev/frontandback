import { test, expect } from '@playwright/test';

test('shows the current time', async ({ page }) => {
  await page.goto('/');

  const timeLocator = page.getByTestId('time-display');
  await expect(timeLocator).toHaveText(/Current time: \d{2}:\d{2}:\d{2}/);
});
