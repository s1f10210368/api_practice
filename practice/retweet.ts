//const playwright = require('playwright');
const axios = require('axios');

async function searchtext() {
  const message = 'ガンダム'

  // 新規ブラウザ起動
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://twitter.com/login');
  // ログイン情報
  await page.getByLabel('電話番号/メールアドレス/ユーザー名').fill('ini5thji');
  await page.getByLabel('電話番号/メールアドレス/ユーザー名').press('Enter');
  await page.getByLabel('パスワード', { exact: true }).fill('iniad5thjissyuu');
  await page.getByLabel('パスワード', { exact: true }).press('Enter');

  // 検索したいツイート
  await page.getByTestId('SearchBox_Search_Input').click();
  await page.getByTestId('SearchBox_Search_Input').fill(message); //ここに検索したいワードを入れる
  await page.getByTestId('SearchBox_Search_Input').press('Enter');

  // 検索後ページのツイートを取得してリツイート
  const tweetElements = await page.$$('div[data-testid="tweet"]');
  if (tweetElements.length > 0) {
    await tweetElements[0].click(); // 一番上のツイートをクリック
    await page.waitForTimeout(50000); // 読み込み待機（適宜調整）
    await page.click('div[data-testid="retweet"]'); // リツイートボタンをクリック
  }

  // ツイート
  await page.getByTestId('tweetButtonInline').click();
}

// 実行
searchtext()