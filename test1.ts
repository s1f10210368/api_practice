const playwright = require('playwright');
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "APIKEY",
  // apiKey : "process.env.API_KEY",
});
const openai = new OpenAIApi(configuration);

const prompt: ChatCompletionRequestMessage = {
  role: "user",
  content:
    "有名な野球選手をツイートしてください",
};

const gettweettext = (content: string) => {
  return content;
};

const functions = {
  gettweettext,
} as const;

const func = async () => {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [prompt],
    function_call: "auto",
    functions: [
      {
        name:"gettweettext",
        description: "あなたの考えをツイートしてください",
        parameters :{
          type: "object",
          properties:{
            name :{
              type:"string",
              description: "あなたの考えをツイートしてください",
            },
          },
          required:["name"],
        },
      } ,   
    ],
  });  

  const message = res.data.choices[0].message;
  console.log("message", message);
  const functionCall = message?.function_call;
  
  if (functionCall) {
    const args = JSON.parse(functionCall.arguments || '{}');
    const stringargs = Object.values(args)[0];

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
    await page.getByRole('textbox', { name: 'Tweet text' }).fill(stringargs);
  
    // ツイート
    await page.getByTestId('tweetButtonInline').click();
}};

func();