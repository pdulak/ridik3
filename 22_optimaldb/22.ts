import {get_token_and_task_data, send_answer} from "../modules/tasks"
import OpenAI from "openai";

const fs = require('fs');
const file_name = "optimized8.json";

const system_prompt = `Goal: optimize the string size. 
Return the string provided by the user as concise as possible. Remove filler words, but keep the meaning. 
Focus on preserving all the information, but make it as short as possible. 
Example source:
Podczas przerw na uczelni gra w szachy, doskonaląc umiejętność strategicznego myślenia. Udziela też korepetycji z prawa konstytucyjnego, budując swoją markę jako prawnik. Tatuaż na jej plecach przedstawia symbole róży i gołębia, to dla niej bardzo osobiste.
Example result: 
Na uczelni gra w szachy. Udziela korepetycji z prawa konstytucyjnego. Tatuaż na jej plecach przedstawia różę i gołębia.
`;

async function optimize_length(text:string) : string {
    const openai = new OpenAI();
    const messages = [
        { "role": "system", "content": system_prompt },
        { "role": "user", "content": text },
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages
    });

    return response.choices[0].message.content;
}

async function main() {
    const data = await get_token_and_task_data("optimaldb")
    const database_json_url = data.database;
    const friends = await fetch(database_json_url).then(r => r.json());
    const optimized = {};
    let answer = "";


    console.log(friends);

    // join in string
    for (const friend in friends) {
        let source = "";
        const length_limit = 3000;

        optimized[friend] = [];
        for (const info in friends[friend]) {
            if (source.length < length_limit) {
                source += friends[friend][info] + " ";
            } else {
                console.log("S: ", source);
                const destination = await optimize_length(source);
                console.log(`---\nD: `, destination, `\n---`);
                optimized[friend].push(destination);
                source = "";
            }
        }
        if (source.length > 0) {
            console.log("S: ", source);
            const destination = await optimize_length(source);
            console.log(`---\nD: `, destination, `\n---`);
            optimized[friend].push(destination);
        }
    }

    console.log(optimized);
    // convert to json string and return the length
    console.log(JSON.stringify(optimized).length);

    // write to file named "optimized.json"
    fs.writeFile(file_name, JSON.stringify(optimized), function(err) {
        if (err) {
            console.log(err);
        }
    });

    // prepare the answer string
    const answer_json = optimized;

    for (const friend in answer_json) {
        for (const info in answer_json[friend]) {
            const info_part = answer_json[friend][info];
            // replace \n with "friend"
            answer += friend + ": " + info_part.replace(/\n/g, friend + ": ");
        }
    }

    console.log("json: ", answer_json);
    console.log("answer: ", answer);

    send_answer(answer);
    // end the program
    return;


}

main();