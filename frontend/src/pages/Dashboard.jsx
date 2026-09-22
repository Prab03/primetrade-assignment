import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch {
      setMsg('Failed to fetch tasks');
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', { title, description });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch {
      setMsg('Failed to create task');
    }
  };

  const toggleComplete = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, { completed: !task.completed });
      fetchTasks();
    } catch {
      setMsg('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch {
      setMsg('Failed to delete task');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <form onSubmit={createTask} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-3 mb-8">
          <input
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Add Task
          </button>
        </form>

        {msg && <p className="text-sm text-red-600 text-center mb-4">{msg}</p>}

        <div className="flex flex-col gap-3">
          {tasks.length === 0 && (
            <p className="text-center text-gray-400 text-sm">No tasks yet. Add one above!</p>
          )}
          {tasks.map(task => (
            <div
              key={task._id}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div>
                <h4 className={`font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>
                )}
                <span className={`text-xs font-medium ${task.completed ? 'text-green-600' : 'text-orange-500'}`}>
                  {task.completed ? '✓ Completed' : '⏳ Pending'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleComplete(task)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}