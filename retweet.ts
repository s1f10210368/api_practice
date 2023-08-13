import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://twitter.com/home');
  await page.goto('https://twitter.com/login');
  await page.goto('https://twitter.com/i/flow/login');
  await page.locator('label div').nth(3).click();
  await page.getByLabel('電話番号/メールアドレス/ユーザー名').fill('ini5thji');
  await page.getByLabel('電話番号/メールアドレス/ユーザー名').press('Enter');
  await page.getByLabel('パスワード', { exact: true }).fill('iniad5thjissyuu');
  await page.getByLabel('パスワード', { exact: true }).press('Enter');
  await page.getByTestId('SearchBox_Search_Input').click();
  await page.getByTestId('SearchBox_Search_Input').fill('pokemon');
  await page.getByTestId('SearchBox_Search_Input').press('Enter');
  await page.getByLabel('4050 Retweets. Retweet').click();
  await page.getByText('Retweet').click();
});