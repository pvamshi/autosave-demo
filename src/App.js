import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import { Button } from "@blueprintjs/core";
import SaveTask from "./SaveTask";
import Task from "./Task";
import { keyBy } from "lodash";

export const BASE_URL = "http://localhost:3001"; //should be moved to .env

function App() {
  const [tasks, setTasks] = useState(null); // Map of tasks with id as key
  const [selectedTaskId, setSelectedTaskId] = useState(null); //task id that is being edited

  useEffect(function initializeTasks() {
    async function initialize() {
      setTasks(keyBy(await fetchTasks(), "id"));
    }
    initialize();
  }, []); // Run only once

  function saveTask(task) {
    setSelectedTaskId(null);
    setTasks(Object.assign({}, tasks, { [task.id]: task })); // update the task at the id
  }

  if (!tasks) {
    return <p>Loading tasks...</p>;
  }
  return (
    <Fragment>
      <Button
        style={{
          marginTop: "2em",
          marginLeft: "2em"
        }}
        intent="success"
        text="Create Item"
      />
      {Object.values(tasks).map(task => (
        <Task
          task={task}
          key={task.id}
          selectedTaskId = {selectedTaskId}
          setSelectedTaskId={setSelectedTaskId}
        />
      ))}
      {selectedTaskId !== null && (
        <SaveTask task={tasks[selectedTaskId]} onTaskSave={saveTask} />
      )}
    </Fragment>
  );
}
export default App;

async function fetchTasks() {
  const tasksResponse = await fetch(`${BASE_URL}/tasks`);
  if (tasksResponse.status !== 200) {
    throw new Error("Network error while fetching tasks");
  }
  return await tasksResponse.json();
}
