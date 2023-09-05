import { OpenAI } from "langchain/llms/openai";
import fs from 'fs';
import { initializeAgentExecutor } from "langchain/agents";
import { SerpAPI } from "langchain/tools";

const SerpAPIkey = "64716a3a1cd2057f46b781f642d375ee9eb53ef80b941fcbdc3489c6b8c3a555"

// 環境変数
require("dotenv").config();

function readTextFromFile(filePath: string) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return data;
    } catch (error) {
      console.error('ファイルの読み込みエラー:', error);
      return null;
    }
}

const filePath = '/Users/iniad/Documents/TS/api_practice/output.txt'; // ファイルのパスを適切に指定してください
const content: string | null = readTextFromFile(filePath);

export const run = async () => {
    // LLMの準備
    const llm = new OpenAI({ temperature: 0.9 });
    try {
      if (content !== null) {
        // LLMの呼び出し
        const res = await llm.call(JSON.stringify(content)); // テキストデータをJSONオブジェクトとしてラップ
        console.log('aaa');
        console.log(res);
      } else {
        console.error("ファイルの読み込みエラーが発生しました。");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
};

export const runAgent = async () => {
    const llm = new OpenAI({ temperature: 0 });
  
    const tools = [new SerpAPI()];
  
    const executor = await initializeAgentExecutor(
      tools,
      llm,
      "zero-shot-react-description",
      true,
    );
  
    // first web検索
    const firstPrompt = content;
    const firstRes = await executor.call({ input: firstPrompt });
    console.log("User1", firstPrompt);
    console.log("Agent1", firstRes.output);
  };

runAgent();