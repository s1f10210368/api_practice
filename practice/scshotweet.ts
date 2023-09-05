import playwright from 'playwright';

let browser;

const initBrowser = async () => {
  browser = await playwright.chromium.launch({ headless: false });
};


const gettwitter = async () => {
  if (!browser) {
    await initBrowser();
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://twitter.com/home');
  await page.goto('https://twitter.com/login');
  await page.goto('https://twitter.com/i/flow/login');
  await page.getByLabel('電話番号/メールアドレス/ユーザー名').click();
  await page.getByLabel('電話番号/メールアドレス/ユーザー名').fill('ini5thji');
  await page.getByLabel('電話番号/メールアドレス/ユーザー名').press('Enter');
  await page.getByLabel('パスワード', { exact: true }).fill('iniad5thjissyuu');
  await page.getByLabel('パスワード', { exact: true }).press('Enter');
  // ... ログインの他のステップ ...

  return page;
};

const tweetscreenshot = async () => {
  const page = await gettwitter();
  await page.goto('https://twitter.com/home');
  await page.goto('https://twitter.com/home');
  await page.click('input[aria-label="Add photos or video"]');
  const file = await page.waitForSelector('input[type="file"]');
  await file.setInputFiles('/Users/iniad/Documents/TS/alan/othello_turn.png');
  await page.getByTestId('tweetButtonInline').click();
  // ... スクリーンショットの他のステップ ...
};

tweetscreenshot();
