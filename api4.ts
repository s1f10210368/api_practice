import axios from 'axios';

const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
const apiKey = 'APIKEY'; // あなたの実際のAPIキーを設定してください

const inputData = {
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: 'Hey there! I am a laid-back assistant, ready to chat and help you out.' },
    { role: 'user', content: 'あなたは1人の人間であり好きなものや趣味などがちゃんとある。その感情によって話し方は変わるものである。あなたの趣味はなんですか？'},
  ]
};

const count = 5; //ループ回数
let nowcount = 0;

function makeRequest(){
  axios.post(apiEndpoint, inputData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      const message = response.data.choices[0]?.message;
      if (message) {
        console.log('Response:', message.content); 
        inputData.messages = [{role: 'user', content: message.content}]
        nowcount++;
        if (nowcount < count){
          makeRequest();
        } else {
          console.log('終了')
        }
      } else {
        console.error('Error: Response message not found.');
      }
    })
    .catch((error) => {
      console.error('Error:', error.message);
    })
}

makeRequest();
  
