import axios from 'axios';
import fs from 'fs';
import player from 'play-sound';

// 更新したいテキスト
const text = 'こんにちは';
const soundPlayer = player({});

axios
  .post('http://localhost:50021/audio_query', {
    text: text,
    speaker: 0,  // speaker id (0:四国めたん, 1:京町セイカ)
    speedScale: 1.0,
    pitchScale: 0.0,
    intonationScale: 1.0,
    volumeScale: 1.0,
  })
  .then((response) => {
    // レスポンスから、音声データを取得
    axios.post('http://localhost:50021/synthesis', response.data)
      .then((response) => {
        // 音声データを保存
        const audio = Buffer.from(response.data.wav, 'base64');
        fs.writeFileSync('output.wav', audio);
        // 音声を再生
        soundPlayer.play('output.wav', (err: any) => {
          if (err) throw err;
        })
      });
  });