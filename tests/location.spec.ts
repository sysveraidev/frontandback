import { test, expect } from '@playwright/test';

test.use({
  permissions: ['geolocation'],
  geolocation: { latitude: 59.3293, longitude: 18.0686 },
});

test('displays the current geolocation coordinates', async ({ page }) => {
  await page.goto('/');

  const locationLocator = page.getByTestId('location-display');
  await expect(locationLocator).toContainText('latitude 59.3293');
  await expect(locationLocator).toContainText('longitude 18.0686');
});
