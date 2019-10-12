import { Button, Card, Elevation, H6 } from "@blueprintjs/core";
import React from "react";

function Task({ task, selectedTaskId, setSelectedTaskId }) {
  return (
    <Card
      elevation={task.id === selectedTaskId ? Elevation.FOUR : Elevation.TWO}
      key={task.id}
      style={{ width: "30%", margin: "2em" }}
    >
      <H6>{task.name}</H6>
      <p>@{task.assignee}</p>
      {selectedTaskId !== task.id && (
        <Button onClick={() => setSelectedTaskId(task.id)}>Edit</Button>
      )}
    </Card>
  );
}
export default Task;
