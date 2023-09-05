const playwright = require('playwright');

async function gettrend(){
    // Chromium ブラウザを起動します。headless モードは無効にしています（GUI 表示あり）
    const browser = await playwright.chromium.launch({ headless: false });

    // ブラウジングコンテキストを作成します
    const context = await browser.newContext();

    // 新しいページを作成します
    const page = await context.newPage();

    // Twitter ログインページに移動します
    await page.goto('https://twitter.com/login');
    await page.goto('https://twitter.com/i/flow/login');
    await page.getByLabel('電話番号/メールアドレス/ユーザー名').click();
    await page.getByLabel('電話番号/メールアドレス/ユーザー名').fill('ini5thji');
    await page.getByLabel('電話番号/メールアドレス/ユーザー名').press('Enter');
    await page.getByLabel('パスワード', { exact: true }).fill('iniad5thjissyuu');
    await page.getByLabel('パスワード', { exact: true }).press('Enter');

    // "Explore" タブへ移動
    await page.getByTestId('AppTabBar_Explore_Link').click();

    // "Trending" タブをクリックしてトレンドを表示
    await page.getByRole('tab', { name: 'Trending' }).click();

    // トレンドアイテムのセレクター
    // 3階層の深さにある <div> 要素を選択
    const itemsSelector = 'section > div > div > div';

    // トレンドアイテムの表示を待機
    await page.waitForSelector(itemsSelector);
    
    // トレンドアイテムを取得
    const items = await page.$$(itemsSelector);
    const length = items.length;

    if (length > 0) {
        // 取得するトレンド数
        const trendsToRetrieve = 5;

        for (let i = 0; i < trendsToRetrieve; i++) {
            const textElement = await items[i].$('div'); // i番目のトレンドを取得
            if (textElement) {
                const text = await textElement.innerText();
                console.log(`Trend ${i + 1}: ${text}`);
            } else {
                console.log(`Trend ${i + 1}: No text element found in the selected trend.`);
            }
        }       
        } else {
        console.log("No trend items found.");
        }    
}

// 関数を呼び出してトレンド情報を取得する
gettrend();

