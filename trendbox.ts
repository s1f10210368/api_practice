const playwright = require('playwright');

async function gettrend() {
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://twitter.com/login');
  // ログインの処理を追加
  await page.getByLabel('電話番号/メールアドレス/ユーザー名').click();
  await page.getByLabel('電話番号/メールアドレス/ユーザー名').fill('ini5thji');
  await page.getByLabel('電話番号/メールアドレス/ユーザー名').press('Enter');
  await page.getByLabel('パスワード', { exact: true }).fill('iniad5thjissyuu');
  await page.getByLabel('パスワード', { exact: true }).press('Enter');
  
  await page.getByTestId('AppTabBar_Explore_Link').click();
  await page.getByRole('tab', { name: 'Trending' }).click();
  
  // トレンドアイテムのセレクター
  const itemsSelector = 'section > div > div > div';
  await page.waitForSelector(itemsSelector);
  
  // トレンドアイテムを取得
  const items = await page.$$(itemsSelector);
  const trends:string[] = [];
  const length = items.length;


  for (let i = 0; i < length; i++) {
    const item = items[i];
    const textElement = await item.$('div');
    if (textElement) {
      const text = await textElement.innerText();
      
      // 正規表現を使用してトレンド情報を選別
      const hashtagPattern = /#([^ \t\n]+)/g;
      const match = text.match(hashtagPattern);
      if (match) {
        trends.push(...match);
      }
    }
  }
  await browser.close();
  return trends;
}

(async () => {
    const trendArray = await gettrend();
    for (const trend of trendArray) {
      console.log(trend);
    }
  })();