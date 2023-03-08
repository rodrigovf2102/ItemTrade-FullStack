import { defaultError } from "@/errors";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

async function filterSwearword(message: string) : Promise<string> {
  let response;

  const swearwords : string[] = JSON.parse(process.env.SWEARWORDS);
  const messages : ChatCompletionRequestMessage[] = [];
  swearwords.map(swearword => (
    messages.push({role:"user",content:`Answer with one word ( yes or no ).
      Can the expression ${swearword} be a swearword or a intimate body part or a inappropriate action to do in public?`}),
    messages.push({role:"assistant",content:"Yes"})
  ));
  messages.push({role: "user", content: message});

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0,
      n:1,
    });
    response = completion.data.choices[0].message.content.trim();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.response.statusText);
    throw defaultError(`${error.message}`);
  }
  return response;
}

export default filterSwearword;