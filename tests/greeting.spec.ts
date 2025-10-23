import { test, expect } from '@playwright/test';

test('greets the user and flags when the user is older than 25', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('name-input').fill('Alice');
  await page.getByTestId('age-input').fill('30');
  await page.getByTestId('submit-button').click();

  const message = page.getByTestId('result-message');
  await expect(message).toHaveText('Hello Alice you are old!');

  await page.getByTestId('name-input').fill('Bob');
  await page.getByTestId('age-input').fill('20');
  await page.getByTestId('submit-button').click();

  await expect(page.getByTestId('result-message')).toHaveText('Hello Bob');
});
