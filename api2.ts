import axios from 'axios';

const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
const apiKey = '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'; // あなたの実際のAPIキーを設定してください
const inputData = {
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Tell me a joke.' },
    { role: 'assistant', content: 'Sure! Why did the chicken cross the road?' },
    { role: 'user', content: "I don't know, why did the chicken cross the road?" }
  ]
};

axios.post(apiEndpoint, inputData, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    console.log('API Response:', response.data);
    const message = response.data.choices[0]?.message[0]?.content;
    if (message) {
      console.log('Response:', message);
    } else {
      console.error('Error: Response message not found.');
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
