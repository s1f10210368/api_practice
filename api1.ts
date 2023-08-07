import axios from 'axios';

async function getChatCompletion(): Promise<any> {
  const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
  const apiKey = 'APIKEY'; // あなたの実際のAPIキーを設定してください
  const inputData = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Who won the world series in 2020?' }
    ]
  };

  try {
    const response = await axios.post(apiEndpoint, inputData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('API request failed.');
  }
}

// 関数を呼び出してAPIリクエストを実行する
getChatCompletion()
  .then((responseData) => {
    console.log('Response:', responseData);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
