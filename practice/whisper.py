import openai
import json
import os
import pyaudio
import wave
import requests
import argparse

openai.api_key = "APIKEY"

def whisper():
    model_id = "whisper-1"
    file_path = "latest.wav"
    with open(file_path, "rb") as audio_file:
        response = openai.Audio.transcribe(
            file=audio_file,
            model=model_id,
            response_format="text"
        )
    print("今あなたが言った事:"+response)
    return(response)


def rokuon():

    # 録音設定
    CHUNK = 1024  # バッファサイズ
    FORMAT = pyaudio.paInt16  # サンプルサイズ
    CHANNELS = 1  # モノラル
    RATE = 44100  # サンプリングレート
    RECORD_SECONDS = 2  # 録音する秒数
    OUTPUT_FILE = "latest.wav"  # 録音データの保存先ファイル名

# PyAudioオブジェクトの作成
    audio = pyaudio.PyAudio()

# 録音ストリームの開始
    stream = audio.open(format=FORMAT,
                        channels=CHANNELS,
                        rate=RATE,
                        input=True,
                        frames_per_buffer=CHUNK)

    print("聞き取っています..")

    frames = []  # 録音データを格納するリスト

    # 録音データの取得
    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)

    print("分析しています..")

    stream.stop_stream()
    stream.close()
    audio.terminate()

    wf = wave.open(OUTPUT_FILE, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(audio.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()

HOSTNAME='localhost'

def gpt35turbo(prompt):
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are playing a game of shiritori with a bot. 回答は必ず日本語"},
            {"role": "user", "content": prompt}
        ]
    )
    
    response = completion.choices[0].message
    bot_response = response['content']
    
    return bot_response

def play_shiritori():
    print("しりとりbotへようこそ!")
    print("スタートするには最初の単語を入力してね!")
    
    while True:
        user_input = input("あなた: ")
        #rokuon()
        #user_input = whisper()
        
        if user_input[len(user_input) - 1] == "ん":
            print("んがついてるよーばいばいー")
            break
        if user_input.lower() == "やめる":
            print("プレイ感謝!")
            break
        
        bot_response = gpt35turbo(user_input)
        print("しりとりbot:", bot_response)

play_shiritori()
