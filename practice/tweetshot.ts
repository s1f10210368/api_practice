import { test } from "node:test";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
const playwright = require('playwright');
const axios = require('axios');

const apiKey = process.env.API_KEY;

const configuration = new Configuration({
  apiKey: "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",
  // apiKey
});
const openai = new OpenAIApi(configuration);

const prompt: ChatCompletionRequestMessage = {
  role: "user",
  content:
    "面白いことを20文字以内でツイートして"
};

const getTwitter = (content: string)=>{
  if (content){
    return `${content}`;
  }else{
    return "コンテンツがありません";
  }
}

const runplaywrightTweet = async (content:string) =>{
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

  // ページのサイズを取得
  const pageDimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    };
  });

  // スクリーンショットを取得して特定の領域を切り抜く
  const screenshotPath = 'othello_turn.png';
  await page.screenshot({
    path: screenshotPath,
    clip: {
      x: pageDimensions.width / 2,
      y: pageDimensions.height / 2,
      width: pageDimensions.width / 2,
      height: pageDimensions.height / 2
    }
  });

  // ツイート内容入力
  const tweetTextbox = await page.getByRole('textbox', { name: 'Tweet text' });
  await tweetTextbox.click();
  await tweetTextbox.fill(content);

  if(content.includes("#")){
      await tweetTextbox.press('Escape')
  }

  //ここで写真を追加
  await page.getByLabel('Add photos or video').click();
  const file = await page.waitForSelector('input[type="file"]');
  await file.setInputFiles('/Users/iniad/Documents/TS/api_practice/screenshot.png')

  // ツイート
  await page.getByTestId('tweetButtonInline').click();
}

const functions = {
  getTwitter,
  runplaywrightTweet,
} as const;

const func = async () => {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [prompt],
    function_call: "auto",
    functions: [
      {
        name: "runplaywrightTweet",
        description:"ツイートを送信する",
        parameters:{
            type: "object",
            properties:{
                content:{
                    type:"string",
                    description: "ツイートする内容",
                },
            },
            required:["content"],
        }
      },
      {
        name:"getTwitter",
        description:"ツイッターにつぶやく内容簡潔に取得",
        parameters :{
          type : "object",
          properties:{
            name :{
              type :"string",
              description: "ツイートする内容を１行程度で表す",
            },
          },
          required : ["name"],
        },
      },      
    ],
  });

  const message = res.data.choices[0].message;
  
  const functionCall = message?.function_call;
  if(!functionCall){
    console.log("functioncallingはよびだされませんでした");
  }
  if (functionCall) {
    const args = JSON.parse(functionCall.arguments || "{}");

    // @ts-ignore
    const funcRes = functions[functionCall.name!](args.name);

    // 関数の結果をもとに再度質問
    const res2 = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        prompt,
        message,
        {
          role: "function",
          content: funcRes,
          name: functionCall.name,
        },
      ],
    });
    const responseMessage = res2.data.choices[0].message;
    console.log("answer", responseMessage);
    if(responseMessage?.content !== undefined &&prompt.content?.includes("ツイートして")){
        const tweetContent = responseMessage.content.slice(1,-1);
        await runplaywrightTweet(tweetContent);
    }  
  };  
};

func();