"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const openai_1 = require("openai");
const config = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(config);
async function filterSwearword(message) {
    let response;
    const swearwords = JSON.parse(process.env.SWEARWORDS);
    const messages = [];
    swearwords.map(swearword => (messages.push({ role: "user", content: `Answer with one word ( yes or no ).
      Can the expression ${swearword} be a swearword or a intimate body part or a inappropriate action to do in public?` }),
        messages.push({ role: "assistant", content: "Yes" })));
    messages.push({ role: "user", content: message });
    // eslint-disable-next-line no-console
    console.log(message, messages);
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0,
            n: 1,
        });
        response = completion.data.choices[0].message.content.trim();
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log(error.response.statusText);
        throw (0, errors_1.defaultError)(`${error.message}`);
    }
    return response;
}
exports.default = filterSwearword;
