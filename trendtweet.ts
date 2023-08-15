//const playwright = require('playwright');
const axios = require('axios');

async function getTrend() {
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
    console.log(trends);
    return trends;
}

async function tweetGeneratedText(content:string) {
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const apiKey = 'APIKEY'; // あなたの実際のAPIキーを設定してください
    const inputData = {
        model: 'gpt-3.5-turbo',
        messages: [
        { role: 'system', content: 'Ready to brighten your day with some witty responses!' },
        { role: 'user', content: content},
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
    const tweetTextbox = await page.getByRole('textbox', { name: 'Tweet text' });
    await tweetTextbox.click();
    await tweetTextbox.fill(content);

    if(content.includes("#")){
        await tweetTextbox.press('Escape')
    }

    // ツイート
    await page.getByTestId('tweetButtonInline').click();
    await browser.close();
}

// 実行
async function main() {
    const trends = await getTrend();
    
    const browser = await playwright.chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://twitter.com/login');
    
    // ログイン処理を行う
    
    for (const trend of trends) {
        await tweetGeneratedText(`I'm tweeting about the trending topic: ${trend}`);
    }

    await browser.close();
}

main();
