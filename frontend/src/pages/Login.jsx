import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [u,setU] = useState(''); const [p,setP] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await API.post('/auth/login', { username: u, password: p });
      localStorage.setItem('token', r.data.token);
      nav('/admin');
    } catch (e) {
      alert('Login failed');
    }
  };

  return (
    <div style={{maxWidth:420, margin:'40px auto'}}>
      <h2>Admin Login</h2>
      <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:8}}>
        <input placeholder='username' value={u} onChange={e=>setU(e.target.value)} />
        <input placeholder='password' type='password' value={p} onChange={e=>setP(e.target.value)} />
        <div><button type='submit'>Login</button></div>
      </form>
    </div>
  )
}
