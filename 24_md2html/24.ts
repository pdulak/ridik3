import {get_token_and_task_data, send_answer} from "../modules/tasks"
import OpenAI from "openai";
const { getJson } = require("serpapi");

import express from "express";

const app = express();
const port = 3034;
const openai = new OpenAI();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/", async (req, res) => {
    console.log("00000000000000000000000000000000000000000000000000000000")
    console.log("question: ", req.body.question);

    const messages = [
        { "role": "system", "content": `md2html` },
        { "role": "user", "content": req.body.question },
    ];

    const response = await openai.chat.completions.create({
        model: process.env.MOD2HTML_MODEL_ID,
        messages: messages
    });

    const html_content = response.choices[0].message.content
    console.log("00000000000000000000000000000000000000000000000000000000")
    console.log(html_content)
    res.json({ "reply" : html_content });
});


async function main() {
    const data = await get_token_and_task_data("md2html")

    console.log("starting server");
    app.listen(port, () => {
        console.log(`Listening on port ${port}...`);
    });

    await send_answer("https://aidevs.dulare.com/");
}

main();