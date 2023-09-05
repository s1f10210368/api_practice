import fs from 'fs';
import { spawn } from 'child_process';
import axios from 'axios';
import FormData from 'form-data';
import { ConversationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

require("dotenv").config();
const model = 'whisper-1'


// OpenAI APIキー
const apiKey = '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';

// 録音ファイルの保存パス
const audioFilePath = '/Users/iniad/Documents/TS/api_practice/recorded_audio.wav';

// 録音スクリプトの実行関数
function recordAudio(filePath: string, duration: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const recorder = spawn('rec', [filePath, 'rate', '16000', 'channels', '1', 'trim', '0', `${duration}`]);
    
    recorder.on('close', (code) => {
      if (code === 0) {
        console.log('録音が完了しました。');
        resolve();
      } else {
        reject(new Error(`録音中にエラーが発生しました。終了コード: ${code}`));
      }
    });
  });
}

// Whisper APIを使用して音声をテキストに変換する関数
async function transcribeAudioToText(audioFilePath: fs.PathLike) {
    const form = new FormData();
    form.append('file', fs.createReadStream(audioFilePath));
    form.append('model', model);

    const headers = {
        'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
        'Authorization': `Bearer ${apiKey}`,
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, { headers });
        return response.data.text;
    } catch (error) {
        console.error(error);
        throw error;
    }
}



// メイン関数
async function main() {
    const recordingDuration = 10; // 録音する秒数
    await recordAudio(audioFilePath, recordingDuration);
    const transcript = await transcribeAudioToText(audioFilePath);
    
    // テキストをファイルに保存
    const outputPath = 'output.txt';
    fs.writeFileSync(outputPath, transcript, 'utf-8');
    
    console.log('音声をテキストに変換して保存しました。');
}

main().catch(error => console.error('エラー:', error));

/*
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
const content = readTextFromFile(filePath);

// axiosを使用してAPIリクエストをPOSTメソッドで送信
export const runTemplate = async () => {
    const llm = new OpenAI({ temperature: 0 });
    const chain = new ConversationChain({ llm: llm });

    const input = content;
  
    const res = await chain.call({ input: input });
    console.log(res);
};

runTemplate();
*/


