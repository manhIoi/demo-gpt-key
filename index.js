const openai = require("openai");
const colors = require("colors");
const readlineSync = require("readline-sync");
const dotenv = require("dotenv");

async function main() {
    dotenv.config()
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
    const openAi = new openai({
        apiKey: process.env.GPT_API_KEY
    });
    const messagesSystem = [];
    while (true) {
        const userInput = readlineSync.question(colors.yellow("You: "));
        console.info(colors.blue("finished question") + "\n");
        const message = {
            model: "gpt-3.5-turbo",
            messages: [...messagesSystem, { role: "user", content: userInput }],
            stream: true,
        }
        const completionText = await openAi.chat.completions.create(message);
        messagesSystem.push({
            role: "system",
            content: `Là 1 trí tuệ nhân tạo, bạn hãy trả lời thông tin với dữ liệu học được: ${userInput}`
        })
        process.stdout.write(colors.red("Bot: "));
        for await (const chunk of completionText) {
            process.stdout.write(chunk.choices[0]?.delta?.content || "");
        }

        console.info("\n ");
    }
}
main().catch((error) => {
    console.info("LOG_IT:: something error", error);
});
