import React from "react";
import {Button, Card, Classes, Elevation, H5, Label} from "@blueprintjs/core";
import { BASE_URL } from "./App";
import useAutosave from "./autosave";

function SaveTask({ task, onTaskSave }) {
  const [tempTask, updateField, saveTask] = useAutosave(task, {
    URL: BASE_URL,
    entityName: "tasks"
  });
  async function handleUpdate(e) {
    const { name, value } = e.target; //assuming the data is valid. Skipping validation
    updateField(name, value);
  }
  async function handleSave(e) {
    e.preventDefault();
    await saveTask(tempTask);
    onTaskSave(tempTask);
  }

  return (
    <Card
      style={{
        position: "absolute",
        top: "4em",
        right: "2em",
        width: "60%",
        margin: "2em"
      }}
      elevation={Elevation.TWO}
    >
      <H5>Edit Task</H5>
      <form onSubmit={handleSave}>
        <Label>
          Name
          <input
            style={{ width: "30em" }}
            className={Classes.INPUT}
            placeholder="Name of the task"
            onChange={handleUpdate}
            value={tempTask.name}
            name="name"
          />
        </Label>

        <Label>
          Assigned to
          <input
            className={Classes.INPUT}
            placeholder="Assigned user"
            onChange={handleUpdate}
            value={tempTask.assignee}
            name="assignee"
          />
        </Label>
        <Label>
          Due Date
          <input
            type={"date"}
            className={Classes.INPUT}
            placeholder="Due date"
            onChange={handleUpdate}
            value={tempTask.due_date}
            name="due_date"
          />
        </Label>
        <Label>
          Status
          <input
            className={Classes.INPUT}
            placeholder="Status"
            onChange={handleUpdate}
            value={tempTask.status}
            name="status"
          />
        </Label>
        <Button type="submit">Save</Button>
      </form>
    </Card>
  );
}
export default SaveTask;
