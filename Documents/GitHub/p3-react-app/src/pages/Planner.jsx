import React, { useState, useReducer } from "react";
import styles from "../module-styles/Planner-style.module.css";

const Planner = () => {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("");

  const addTask = "add task";
  const deleteTask = "delete task";
  const editTask = "edit task";
  const toggleDone = "toggle done";
  const sortTasks = "sort tasks";

  const plannerReducer = (state, action) => {
    switch (action.type) {
      case addTask:
        return [...state, action.payload].sort((a, b) => {
          if (a.priority === b.priority) {
            return state.indexOf(a) - state.indexOf(b);
          } else {
            if (a.priority === "High Priority") return -1;
            if (b.priority === "High Priority") return 1;
            if (a.priority === "Medium Priority") return -1;
            if (b.priority === "Medium Priority") return 1;
            return 0;
          }
        });

      case deleteTask:
        return state.filter((task) => task.id !== action.payload);
      case editTask:
        return state.map((task) =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updatedTask }
            : task
        );
      case toggleDone:
        return state.map((task) =>
          task.id === action.payload ? { ...task, done: !task.done } : task
        );
      case sortTasks:
        return action.payload;
      default:
        return state;
    }
  };

  const [tasks, dispatch] = useReducer(plannerReducer, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newTask = { task, priority, done: false, id: Date.now() };
    dispatch({ type: addTask, payload: newTask });
    setTask("");
    setPriority("");
  };

  const handleDelete = (taskId) => {
    dispatch({ type: deleteTask, payload: taskId });
  };

  const handleEdit = (taskId, updatedTask) => {
    dispatch({ type: editTask, payload: { id: taskId, updatedTask } });
    setEditedTask(null);
  };

  const handleDone = (taskId) => {
    dispatch({ type: toggleDone, payload: taskId });
  };

  const [editedTask, setEditedTask] = useState(null);

  return (
    <div>
      <div id={styles.header}>
        <h1>TODAY'S TASKS</h1>
      </div>
      <div id={styles.todo}>
        <h2>What to do??</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add task here..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          ></input>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="--">Set Priority...</option>
            <option value="Low Priority">Low Priority</option>
            <option value="Medium Priority">Medium Priority</option>
            <option value="High Priority">High Priority</option>
          </select>
          <button type="submit">Add Task</button>
        </form>
      </div>
      <div id={styles.tasksToDo}>
        <h2>Things to do:</h2>
        {tasks.map((item) => (
          <div key={item.id} id={styles.task}>
            <h4>Task:</h4>
            {item.id === editedTask ? (
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            ) : item.done ? (
              <p style={{ textDecoration: "line-through" }}>{item.task}</p>
            ) : (
              <p className={styles.taskList}>{item.task}</p>
            )}
            <h4>Priority:</h4>
            {item.id === editedTask ? (
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low Priority">Low Priority</option>
                <option value="Medium Priority">Medium Priority</option>
                <option value="High Priority">High Priority</option>
              </select>
            ) : (
              <p className={styles.taskList}>{item.priority}</p>
            )}
            {!item.done ? (
              <div>
                {item.id === editedTask ? (
                  <button
                    className={styles.actionButton}
                    onClick={() => handleEdit(item.id, { task, priority })}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className={styles.actionButton}
                    onClick={() => setEditedTask(item.id)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className={styles.actionButton}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            ) : null}
            <button
              className={styles.actionButton}
              onClick={() => handleDone(item.id)}
            >
              Done
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planner;
