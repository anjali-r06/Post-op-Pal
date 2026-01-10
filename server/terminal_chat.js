import readline from "readline";
import fs from "fs";

// Load database
const knowledgeBase = JSON.parse(
    fs.readFileSync("./knowledge_base.json", "utf-8")
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("🧠 Post-Op Pal Terminal (DB Based)");
console.log("Ask in English / Hindi / Hinglish");
console.log("Type 'exit' to quit\n");

function getReplyFromDB(question) {
    const q = question.toLowerCase();

    for (const item of knowledgeBase) {
        for (const keyword of item.keywords) {
            if (q.includes(keyword)) {
                return item.answer;
            }
        }
    }

    return "Is topic par meri database me abhi information available nahi hai.";
}

function askQuestion() {
    rl.question("You: ", (input) => {

        if (input.toLowerCase() === "exit") {
            console.log("Bot: Session ended.");
            rl.close();
            return;
        }

        const reply = getReplyFromDB(input);
        console.log("Bot:", reply);
        console.log("----------------------------------");

        askQuestion();
    });
}

askQuestion();

