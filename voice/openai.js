// 新しいSpeechSynthesisUtteranceインスタンスを作成
const utterance = new SpeechSynthesisUtterance();

// "speak"ボタン要素を取得
const speakButton = document.querySelector(".speak");

// "pause"ボタン要素を取得
const pauseButton = document.querySelector(".pause");

// "resume"ボタン要素を取得
const resumeButton = document.querySelector(".resume");

// "cancel"ボタン要素を取得
const cancelButton = document.querySelector(".cancel");

// "speak"ボタンがクリックされたときの処理を追加
speakButton.addEventListener("click", () => {
    // ユーザーが入力したテキストを取得して、utteranceのtextプロパティに設定
    utterance.text = document.querySelector(".text").value;
    // ピッチ、速度、音量を設定
    utterance.pitch = document.querySelector(".pitch").value;
    utterance.rate = document.querySelector(".rate").value;
    utterance.volume = document.querySelector(".volume").value;
    // 音声を再生
    speechSynthesis.speak(utterance);
});

// "pause"ボタンがクリックされたときの処理を追加
pauseButton.addEventListener("click", () => {
    // 音声を一時停止
    speechSynthesis.pause();
});

// "resume"ボタンがクリックされたときの処理を追加
resumeButton.addEventListener("click", () => {
    // 一時停止した音声を再開
    speechSynthesis.resume();
});

// "cancel"ボタンがクリックされたときの処理を追加
cancelButton.addEventListener("click", () => {
    // 音声をキャンセル
    speechSynthesis.cancel();
});

// speechSynthesisが利用可能かどうかを確認
if (window.speechSynthesis) {
    let voices = [];

    // 利用可能な音声リストを設定
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

