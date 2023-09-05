const API_KEY = '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'; // Whisper APIのAPIキーを設定
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const audioElement = document.getElementById("audioElement");
const convertButton = document.getElementById("convertButton");
const resultText = document.getElementById("resultText");
let mediaRecorder;
let audioChunks = [];

startButton.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioElement.src = audioUrl;
        };

        mediaRecorder.start();
        startButton.disabled = true;
        stopButton.disabled = false;
    } catch (error) {
        console.error("マイクへのアクセスを取得できませんでした: ", error);
    }
});

stopButton.addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
    }
});


async function convertToText(audioBlob) {
    try {
        const form = new FormData();
        form.append('audio', audioBlob);
        form.append('model', 'whisper-1');

        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            },
        });

        const textResult = response.data.text;
        resultText.textContent = '変換されたテキスト: ' + textResult;
    } catch (error) {
        console.error('音声データをテキストに変換できませんでした:', error);
    }
}

/*
async function converttoText(audioBlob) {

}
*/
/*
const callTranscriptions = (audioBlob) => {
    const XHR = new XMLHttpRequest();
    XHR.open("POST", "https://api.openai.com/v1/audio/transcriptions");
    XHR.setRequestHeader("Authorization", `Bearer ${API_KEY}`);

    var formData = new FormData();
    formData.append("model", "whisper-1");
    formData.append("language", "ja");
    formData.append("file", audioBlob);
    XHR.send(formData);
};
*/
convertButton.addEventListener("click", () => {
    if (audioChunks.length > 0) {
        convertToText(new Blob(audioChunks, { type: 'audio/wav' }));
    } else {
        console.warn("録音データがありません。");
    }
});



