// MediaRecorderと音声データの収集を管理するための変数
let mediaRecorder;
let audioChunks = [];

// 音声を再生するためのHTML audio要素
const audioElement = document.getElementById("audioElement");

// OpenAIのAPIキーとエンドポイント
const apiKey = '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';
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

// ユーザーインタラクション用のボタン要素
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gptButton = document.getElementById("GPT");

// 音声合成用のSpeechSynthesisUtteranceインスタンス
const utterance = new SpeechSynthesisUtterance();

// 開始ボタンがクリックされたときのイベントリスナー
startButton.addEventListener("click", async () => {
  try {
    // ユーザーのマイクから音声ストリームを取得
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    // 音声データが利用可能になったときに実行されるコールバック
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    // 録音が停止したときに実行されるコールバック
    mediaRecorder.onstop = () => {
      // 音声データをBlob形式で生成
      const file = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(file);
      audioElement.src = audioUrl;
      
      // 音声データをAPIに送信してトランスクリプションを取得
      callTranscriptions(file, (text) => {
        console.log(text);
        if (!text) return;
        document.getElementById("result").innerHTML = text;
      });
    };

    // 録音を開始
    mediaRecorder.start();
    startButton.disabled = true;
    stopButton.disabled = false;
  } catch (error) {
    console.error("マイクへのアクセスを取得できませんでした: ", error);
  }
});

// 停止ボタンがクリックされたときのイベントリスナー
stopButton.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    // 録音を停止し、関連するトラックを停止およびクリア
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    mediaRecorder = null;
    audioChunks = [];
    startButton.disabled = false;
    stopButton.disabled = true;
  }
});

const callTranscriptions = (file, callback) => {
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    callback(JSON.parse(event.target.responseText).text);
  });
  XHR.addEventListener("error", (event) => {
    alert("error");
  });
  XHR.open("POST", "https://api.openai.com/v1/audio/transcriptions");
  XHR.setRequestHeader("Authorization", `Bearer ${apiKey}`);

  var formData = new FormData();
  formData.append("model", "whisper-1");
  formData.append("language", "ja");
  formData.append("file", file);
  XHR.send(formData);
};

// OpenAI APIを呼び出してGPT-3.5 Turboを利用してテキストを生成するボタンがクリックされたときのイベントリスナー
gptButton.addEventListener("click", async() => {
    const text = document.getElementById("result").innerHTML;
    const resultElement  = document.getElementById("gptresult");
  
    const inputData = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Hey there! I am your friend, ready to chat and help you out.' },
        { role: 'user', content: text},
      ]
    };
  
    // OpenAI APIにデータを送信して応答を取得
    await axios.post(apiEndpoint, inputData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    })
    .then((response) => {
      const message = response.data.choices[0]?.message;
      if (message) {
        console.log('Response:', message.content); 
        // テキストを取得して音声合成のためのutteranceに設定
        utterance.text = message.content;
        utterance.pitch = document.querySelector(".pitch").value;
        utterance.rate = document.querySelector(".rate").value;
        utterance.volume = document.querySelector(".volume").value;
        // 音声を再生
        speechSynthesis.speak(utterance);
      } else {
        console.error('Error: Response message not found.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

// 音声合成のための音声オプションを設定
if (window.speechSynthesis) {
    let voices = [];

    // 利用可能な音声リストを設定する関数
    function setVoices() {
        if (voices.length) return;
        voices = speechSynthesis.getVoices();
        if (!voices.length) return;
        voices
            .filter((v) => v.lang.startsWith("ja")) // 日本語の音声をフィルタリング
            .forEach((v) => {
                let opt = document.createElement("option");
                opt.text = v.name;
                opt.voice = v;
                // "voice"セレクトボックスに音声オプションを追加
                document.getElementById("voice").appendChild(opt);
            });
    }

    // 音声リストが変更されたときにsetVoicesを呼び出す
    speechSynthesis.addEventListener("voiceschanged", setVoices);
    setVoices(); // 初期音声リストを設定
}
