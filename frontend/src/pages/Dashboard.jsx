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
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>My Tasks</h2>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>

      <form onSubmit={createTask} style={styles.form}>
        <input placeholder="Task title" value={title}
          onChange={e => setTitle(e.target.value)} style={styles.input} required />
        <input placeholder="Description (optional)" value={description}
          onChange={e => setDescription(e.target.value)} style={styles.input} />
        <button type="submit" style={styles.btn}>Add Task</button>
      </form>

      {msg && <p style={{ color: 'red' }}>{msg}</p>}

      <div style={styles.taskList}>
        {tasks.length === 0 && <p>No tasks yet. Add one above!</p>}
        {tasks.map(task => (
          <div key={task._id} style={styles.taskCard}>
            <div>
              <h4 style={{ textDecoration: task.completed ? 'line-through' : 'none', margin: 0 }}>
                {task.title}
              </h4>
              <p style={{ margin: '4px 0', color: '#666' }}>{task.description}</p>
              <span style={{ fontSize: '12px', color: task.completed ? 'green' : 'orange' }}>
                {task.completed ? '✅ Completed' : '⏳ Pending'}
              </span>
            </div>
            <div style={styles.actions}>
              <button onClick={() => toggleComplete(task)} style={styles.actionBtn}>
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button onClick={() => deleteTask(task._id)} style={{ ...styles.actionBtn, background: '#ef4444' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 16px' },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  form:      { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' },
  input:     { padding: '10px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ccc' },
  btn:       { padding: '10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  logoutBtn: { padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  taskList:  { display: 'flex', flexDirection: 'column', gap: '12px' },
  taskCard:  { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  actions:   { display: 'flex', gap: '8px' },
  actionBtn: { padding: '6px 12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};