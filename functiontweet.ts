const playwright = require('playwright');
const axios = require('axios');

async function tweetGeneratedText() {
  const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
  const apiKey = 'APIKEY'; // あなたの実際のAPIキーを設定してください
  const inputData = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Ready to brighten your day with some witty responses!' },
      { role: 'user', content: '短く簡単で面白いことを言って!' },
    ]
  };

  // AIからの返答をとる
  const response = await axios.post(apiEndpoint, inputData, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  const message = response.data.choices[0]?.message;

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

  // ツイート内容入力
  await page.getByRole('textbox', { name: 'Tweet text' }).click();
  await page.getByRole('textbox', { name: 'Tweet text' }).fill(message.content);

  // ツイート
  await page.getByTestId('tweetButtonInline').click();
}

// 実行
tweetGeneratedText()

