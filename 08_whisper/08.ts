import { get_token_and_task_data, send_answer } from "../modules/tasks"
import { OpenAI } from "openai"
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const {mkdir,writeFile} = require("fs/promises");

const openai = new OpenAI()

async function main() {
    const data = await get_token_and_task_data("whisper")

    // using regex extract link from the msg
    const link = data.msg.match(/https:\/\/\S+/)[0];
    console.log("Link: " + link);
    const blob = await fetch(link).then(r => r.blob());
    const file = new File([blob], "audio.mp3");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");
    const transcription_result = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        },
        body: formData
    });
    // get the transcription
    const transcription = await transcription_result.json();

    console.log(transcription)

    const isOK = await send_answer(transcription.text)
}

main();