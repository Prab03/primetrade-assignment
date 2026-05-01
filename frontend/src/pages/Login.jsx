import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} style={styles.input} />
        <input placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} style={styles.input} />
        <button type="submit" style={styles.btn}>Login</button>
        {msg && <p style={styles.msg}>{msg}</p>}
      </form>
      <p>Don't have an account? <a href="/">Register</a></p>
    </div>
  );
}

const styles = {
  container: { maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif' },
  form:      { display: 'flex', flexDirection: 'column', gap: '12px' },
  input:     { padding: '10px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ccc' },
  btn:       { padding: '10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  msg:       { color: 'red' }
};
