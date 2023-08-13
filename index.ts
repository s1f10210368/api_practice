import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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" //入力
});

const openai = new OpenAIApi(configuration);

const getTask = (taskName: string) => {
  return taskName;
};

const functions = {
  getTask,
} as const;

// const Taskinfomation = '料理';
// const TaskInfoInput = async (label: taskModelLabel['label']): Promise<taskModelLabel> => {
//   return (Taskinfomation = label);
//   // ここにlabelの部分をいれたい
// };

// export let messageContent: ChatCompletionResponseMessage;
export const func = async () => {
  const prompt: ChatCompletionRequestMessage = {
    role: 'user',
    content: `料理の内容に関連するTodoリストの内容を1つ教えてください`,
    // このcontentの部分にユーザーが打ち込んだ情報を入れたい
  };
  const res = await openai.createChatCompletion({
    model: 'gpt-4-0613',
    messages: [prompt],
    function_call: 'auto',
    functions: [
      {
        name: 'getTask',
        description: 'タスクの内容を理解する',
        parameters: {
          type: 'object',
          properties: {
            task: {
              type: 'string',
              description: '新しく作成したタスク',
            },
          },
          required: ['task'],
        },
      },
    ],
  });

  const message = res.data.choices[0].message;
  console.log('message', message);
  const functionCall = message?.function_call;

  if (functionCall) {
    // const args = JSON.parse(functionCall.arguments || '{}');
    const args = JSON.parse(functionCall.arguments ?? '{}');
    console.log(args);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // const functionRes = functions[functionCall.name!](args.name);
    const functionRes = functions[functionCall.name](args.name);

    // 関数の結果をもとに再度質問
    const res2 = await openai.createChatCompletion({
      model: 'gpt-4-0613',
      messages: [
        prompt,
        message,
        {
          role: 'function',
          content: functionRes,
          name: functionCall.name,
        },
      ],
    });
    console.log('answer', res2.data.choices[0].message);
    // messageContent = res2.data.choices[0].message;
    // Taskname = res2.data.choices[0].message;
  }
};

func();