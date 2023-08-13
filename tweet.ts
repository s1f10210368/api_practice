import { test, expect } from "@playwright/test";
import { chromium } from "@playwright/test";
import axios from 'axios';  //httpリクエストを行うための便利なライブラリ
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

const configuration = new Configuration({
    apiKey: "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",
    // apiKey : "process.env.API_KEY",
});

const response = await axios.post(apiEndpoint, prompt, {
    headers: {
      Authorization: `Bearer ${configuration.apiKey}`,
      'Content-Type': 'application/json',
    },
});

const runTwitter = (async() =>{
    const message = response.data.choices[0]?.message;
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://twitter.com/login');
    await page.getByLabel('Phone, email, or username').click();
    await page.getByLabel('Phone, email, or username').fill('ini5thji');
    await page.getByLabel('Phone, email, or username').press('Enter');
    await page.getByLabel('Password', { exact: true }).fill('iniad5thjissyuu');
    await page.getByLabel('Password', { exact: true }).press('Enter');
    await page.getByTestId('SideNav_NewTweet_Button').click();
    await page.getByRole('textbox', { name: 'Tweet text' }).click();
    await page.getByRole('textbox', { name: 'Tweet text' }).fill(message.content);
    await page.getByTestId('tweetButton').click();
    return message.content;
});
