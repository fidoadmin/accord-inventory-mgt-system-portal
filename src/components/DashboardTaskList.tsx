import { CheckRounded, DeleteRounded } from "@mui/icons-material";
import React, { useState } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const initialTasks: Task[] = [];

const DashboardTaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState<string>("");

  const handleTaskToggle = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  const handleDelete = (id: number) => {
    const updateTaskList = tasks.filter((item) => item.id !== id);
    setTasks(updateTaskList);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTaskItem: Task = {
        id: tasks.length + 1,
        title: newTask,
        completed: false,
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask("");
    }
  };

  return (
    <div className="w-full mx-auto mt-4">
      <h2 className="font-semibold mb-2 text-center">Task List</h2>
      <div className="mb-4 max-h-48 overflow-y-auto scrollbar-thin">
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-2 border-b last:border-b-0"
            >
              <div className="flex items-center justify-between space-x-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleTaskToggle(task.id)}
                  className="h-4 w-4"
                />
                <p
                  className={`text-sm ${
                    task.completed ? "line-through opacity-60" : "text-text"
                  }`}
                >
                  {task.title}
                </p>
              </div>
              <span onClick={() => handleDelete(task.id)}>
                <DeleteRounded className="deleteButton text-error" />
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Input to add new tasks */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => {
            setNewTask(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddTask();
          }}
          placeholder="New task..."
          className="p-2 text-sm w-full bg-transparent border-b border-primary focus:outline-none"
        />
        <button
          onClick={handleAddTask}
          className=" text-success"
          title="Save New Task"
        >
          <CheckRounded />
        </button>
      </div>
    </div>
  );
};

export default DashboardTaskList;
