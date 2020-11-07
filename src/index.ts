import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 8000;

app.use(express.json());

interface ITask {
    id: number;
    done: boolean;
    description: string;
}

let tasks: ITask[] = [
    {
        id: 1,
        done: false,
        description: "Create a POST method to create more tasks.",
    },
    {
        id: 2,
        done: false,
        description: "Create a PUT method to update tasks",
    },
];

function FindNextId() {
    return Math.max(...tasks.map((task) => task.id)) + 1;
}

//app.get, first part is path, everything after the .tld/
app.get("/tasks", (request, response) => {
    response.send(tasks);
});

app.get("/tasks/:taskId", (request, response) => {
    const taskId = Number(request.params.taskId);
    const foundTask = tasks.find((task) => task.id === taskId);
    if (foundTask) {
        response.status(200).send(foundTask);
    } else {
        response.status(404).send({
            error: 404,
            message: "Could not find task with that ID",
        });
    }
});

app.post("/tasks", (request, response) => {
    const task = {
        id: FindNextId(),
        done: false,
        description: request.body.description,
    };
    tasks.push(task);
    response.status(201).send(tasks);
});

app.put("/tasks/:taskId", (request, response) => {
    const taskId = Number(request.params.taskId);
    const foundTask = tasks.find((task) => task.id === taskId);
    if (foundTask) {
        const task = {
            id: foundTask.id,
            done: false,
            description: request.body.description,
        };
        tasks[foundTask.id - 1] = task;
        response.status(200).send(tasks);
    } else {
        response.status(404).send({
            error: 404,
            message: "That task wasn't found",
        });
    }
});

app.patch("/tasks/:taskId", (request, response) => {
    const taskId = Number(request.params.taskId);
    const foundTask = tasks.find((task) => task.id === taskId);
    if (foundTask) {
        tasks[foundTask.id - 1].done = true;
        response.status(200).send(tasks[foundTask.id - 1]);
    } else {
        response.status(404).send({
            error: 404,
            message: "That task wasn't found",
        });
    }
});

app.delete("/tasks/:taskId", (request, response) => {
    const taskId = Number(request.params.taskId);
    const foundTask = tasks.filter((task) => task.id != taskId);
    if (foundTask.length != tasks.length) {
        tasks = foundTask;
        response.status(200).send(foundTask);
    } else {
        response.status(404).send({
            error: 404,
            message: "That task wasn't found",
        });
    }
});

//Starts the application.  When we call on that port, log something out.
app.listen(port, () => {
    console.log(`Web server listening on localhost:${port}`);
});
