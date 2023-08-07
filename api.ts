import axios from 'axios';  //httpリクエストを行うための便利なライブラリ

const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
const apiKey = 'APIKEY'; // あなたの実際のAPIキーを設定してください

//APIリクエストに送信するデータを定義している
const inputData = {
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: "I'm here to help with coding questions."},
    { role: 'Please ask a question.'},
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'こんにちは' }
  ]
};

// axiosを使用してAPIリクエストをPOSTメソッドで送信
axios.post(apiEndpoint, inputData, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })
  //APIリクエストが成功した場合に実行する
  .then((response) => {
    //APIの応答データを表示する
    console.log('API Response:', response.data);
    //APIの応答データからメッセージ内容を取得。
    //response.data.choicesはAPIが生成した候補の情報を含む配列。[0]を指定することで最初の候補を表示
    const message = response.data.choices[0]?.message?.content;
    if (message) {
      console.log('Response:', message);
    } else {
    //   const totalTokens = response.data.usage?.total_tokens;
    //   console.log('Total Tokens:', totalTokens);
      console.error('Error: Response message not found.');
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });


