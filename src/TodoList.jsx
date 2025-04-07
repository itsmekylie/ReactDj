import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
export default function TodoList() {
  const API_URL = "https://reactdj-8bkt.onrender.com/api/todo/";

  const [tasks, setTasks] = useState(() => {
  const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    setTasks(
      tasks.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const editTask = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
  };

  const saveTask = (index) => {
    if (editingText.trim() === "") return;
    setTasks(tasks.map((t, i) => (i === index ? { ...t, text: editingText } : t)));
    setEditingIndex(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return filter === "Completed" ? task.completed : !task.completed;
  });

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <h2>To-Do List</h2>
      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️" : "🌙"}
      </button>
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="add-btn" onClick={addTask}>Add Task</button>
      </div>
      <div className="filter-section">
        <label>Filter: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <ul className="task-list">
        {filteredTasks.map((t, index) => (
          <li key={index} className={t.completed ? "completed" : ""}>
            <input type="checkbox" checked={t.completed} onChange={() => toggleComplete(index)} />
            {editingIndex === index ? (
              <>
                <input value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                <button className="save-btn" onClick={() => saveTask(index)}>💾 Save</button>
              </>
            ) : (
              <>
                {t.text}
                <button className="edit-btn" onClick={() => editTask(index)}>✏️ Edit</button>
              </>
            )}
            <button className="delete-btn" onClick={() => removeTask(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
