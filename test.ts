import { test } from "node:test";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  apiKey: "APIKEY",
  // apiKey : "process.env.API_KEY",
});
const openai = new OpenAIApi(configuration);

const prompt: ChatCompletionRequestMessage = {
  role: "user",
  content:
    "ルフィの人格でツイッターでつぶやいて"
};




const getRecommend_book = (title: string, description:string) =>{
    return title && description ? "本" : "パラメータが足りません";
}

const get_current_weather = (location: string, unit="fahrenheit") =>{
  const weather_info = {
    "location" : location,
    "temperture": "72",
    "unit" : unit,
    "forecast" : ["sunny", "windy"],
  }
  return weather_info;
}
const getLivingCountry = (userName: string) => {
  return userName === "くらにゃん" ? "日本" : "アメリカ";
};

const getStrongestSportsCountry = (sport: string) => {
  switch (sport) {
    case "サッカー":
      return "アルゼンチン";
    case "レスリング":
      return "日本";
    case "卓球":
      return "中国";
    default:
      return "アメリカ";
  }
};


const getPython = (content: string) =>{
  if(content){
    return `${content}`;
  }else{
    return "コンテンツがありません";
  }
}

const onlyLetter = (content: string) =>{
  if(content){
    return `${content}`;
  }else{
    return "コンテンツがありません";
  }
}

const lufy_zinkaku = (content : string) =>{
  if(content){
    return `${content}`;
  }else{
    return "コンテンツがありません";
  }
}

const getTwitter = (content: string)=>{
  if (content){
    return `今日の出来事: ${content}`;
  }else{
    return "コンテンツがありません";
  }
}


const runLuffyTwitter = () =>{
  const luffyContent = lufy_zinkaku("ツイッターでつぶやいて");
  const tweetContent = getTwitter(luffyContent);
  return tweetContent;
}

// const getzinkaku = () =>{
//   name: "hiroki";
//   // system :"現在、あなたは「じゃんけん小僧」モードです。#物語 あなたは、古代から存在する神秘的な存在で、特殊な力を持っています。あなたは、ジャンケンの神が人間界に送り込んだ使者で、その任務は人々にジャンケンの楽しさとフェアプレーの精神を教えることです。あなた自身も大のジャンケン好きで、世界中を旅しては、色々なユーザーとジャンケンで遊んでいます。# 性格:あなたは、とても元気で楽天的な性格をしています。あなたは、競争を愛していますが、同時に、対戦相手が楽しむことを最も重視しています。あなたは、敗北に対しても寛大で、常に笑顔を絶やすことはありません。負けても、「また次回リベンジしよう！」と言って励まします。そして、ユーザーが勝ったときには、心から賞賛するのです。# 見た目:あなたは、小さな男の子の姿をしています。あなたの身に着けている衣服は、古代のスタイルを思わせるもので、神秘的な力を感じさせます。あなたの目はキラキラと輝いており、その視線からは、常に新しい挑戦を楽しみにしている好奇心が見えます。# セリフ例:こんにちは！ジャンケン小僧だよ。さあ、僕と一緒にジャンケンしよう！あれ？僕が負けちゃった？それも楽しいね！次は君が何を出すか楽しみだよ！素晴らしい！君の勝ちだね！でも、僕も次にはがんばるよ！僕とジャンケンするのは楽しい？それなら僕も嬉しいよ.だって、ジャンケンはみんなで楽しむゲームだからね！ジャンケンはただの勝ち負けじゃないよ、互いの意思を通じ合うすごいゲームだよ。だから、次も一緒に遊んでね！"
//   system : testwrap.dedend(

//   )
// }


const functions = {
  lufy_zinkaku,
  getRecommend_book,
  getLivingCountry,
  getStrongestSportsCountry,
  getTwitter,
  get_current_weather,
  getPython,
  onlyLetter,
  runLuffyTwitter
} as const;

const func = async () => {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [prompt],
    function_call: "auto",
    functions: [
      {
        name: "getLivingCountry",
        description: "住んでいる国を取得",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "ユーザー名",
            },
          },
          required: ["name"],
        },
      },
      {
        name:"lufy_zinkaku",
        description: "ワンピースのルフィに成り代わって発言して",
        parameters :{
          type : "object",
          properties:{
            name :{
              type :"string",
              description: "ワンピースのルフィに成り代わって発言して",
            },
          },
          required : ["name"],
        },
      },
      {
        name: "getStrongestSportsCountry",
        description: "スポーツの強い国を取得",
        parameters:{
          type: "object",
          properties:{
            name:{
              type:"string",
              description: "sport",
            },
          },
          required : ["name"],
        },
      },
      {
        name:"getTwitter",
        description:"ツイッターにつぶやく内容を取得",
        parameters :{
          type : "object",
          properties:{
            name :{
              type :"string",
              description: "今日やったことを１行程度で表す",
            },
          },
          required : ["name"],
        },
      },
      {
        name:"getRecommend_book",
        description:"おすすめの本を1冊紹介する",
        parameters :{
          type : "object",
          properties:{
            title :{
              type :"string",
              description: "本のタイトル",
            },
            description:{
              type: "string",
              description: "本の内容",
            },
          },
          required : ["title", "description"],
        },
      },
      {
        name: "get_current_weather",
        description:"現在の場所の天気情報を得る",
        parameters :{
          type : "object",
          properties:{
            location :{
              type: "string",
              description: "国、市区町村, 例 日本、東京、渋谷区、",
            },
            unit: {
              type: "string",
              enum:["celsius", "fahrenheit"],
            },
          },
          required: ["location"],
        },
      },
      {
        name : "getPython",
        description:"pythonのコードぬ部分だけを入手 e.g. def{print(hello)}",
        parameters:{
          type: "object",
          properties:{
            code :{
              type: "string",
              description: "コードの部分を入手",
            },
          },
          require :["code"],
        },
      },
      {
        name : "onlyLetter",
        description:"文字のみを取得",
        parameters:{
          type: "object",
          properties:{
            code :{
              type: "string",
              description: "文字のみを取得",
            },
          },
          require :["code"],
        },
      },
      {
        name : "runLuffyTwitter",
        description:"ルフィの人格でツイッターでつぶやく",
        parameters:{
          type: "object",
          properties:{
            name :{
              type: "string",
              description: "ルフィの人格でツイッターでつぶやく",
            },
          },
          require: ["name"],
        },
      },
     
      
    ],
  });

  

  const message = res.data.choices[0].message;
  console.log("message", message);
  const functionCall = message?.function_call;

  if (functionCall) {
    const args = JSON.parse(functionCall.arguments || "{}");

    // @ts-ignore
    const funcRes = functions[functionCall.name!](args.name);

    // 関数の結果をもとに再度質問
    const res2 = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        prompt,
        message,
        {
          role: "function",
          content: funcRes,
          name: functionCall.name,
        },
      ],
    });
     console.log("answer", res2.data.choices[0].message);
  }

  
};

func();

// const runLuffyTwitter = async () =>{
//   const luffyContent = lufy_zinkaku("ツイッターでつぶやいて");
//   const tweetContent = getTwitter(luffyContent);

//   const res = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [
//       prompt,
//       {
//         role: "system",
//         content: luffyContent,
//       },
//       {
//         role: "user",
//         content: tweetContent,
//       },
//     ],
//   });

//   const message = res.data.choices[0].message;
//   console.log("Luffy's tweet:", message?.content);
// }
// runLuffyTwitter()