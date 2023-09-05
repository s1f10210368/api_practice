
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const express = require('express');
const app = express();
const apiKey = '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';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';


require("dotenv").config();
const model = 'whisper-1'

app.post('/transcribe', upload.single('file'), async (req: { file: { path: fs.PathLike; }; }, res: { send: (arg0: any) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path));
    form.append('model', model);

    const headers = {
        'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
        'Authorization': `Bearer ${apiKey}`,
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/whisper/translate', form, { headers });
        res.send(response.data.text);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error in transcription');
    }
});


const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const convertButton = document.getElementById("convertButton");
const resultText = document.getElementById("resultText");

let recorder;
let audioChunks = [];

startButton.onclick = async function(){
    let stream = await navigator.mediaDevices.getUserMedia({audio:true});
    recorder = new MediaRecorder(stream);
    recorder.start();
    audioChunks = [];
    recorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };
    startButton.disabled = true;
    stopButton.disabled = false;
}

stopButton.onclick = function() {
    recorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
    convertButton.disabled = false;
}

convertButton.onclick = async function() {
    const audioBlob = new Blob(audioChunks);
    const audioFile = new File([audioBlob], "recording.wav", { type: audioBlob.type });
    const form = new FormData();
    form.append('file', audioFile);

    let response = await fetch("<Your server endpoint>", {
      method: "POST",
      body: form
    });

    if(response.ok) {
      let text = await response.text();
      resultText.textContent = text;
    } else {
      console.log("HTTP-Error: " + response.status);
    }
}