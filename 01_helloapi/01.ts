import { getTokenAndTaskData, sendAnswer } from "../modules/tasks"

const helloTask = async () => {
    const data = await getTokenAndTaskData("helloapi")
    await sendAnswer(data.cookie)
}

helloTask()