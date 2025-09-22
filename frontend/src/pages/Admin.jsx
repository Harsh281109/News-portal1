import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function authHeader(){ const t = localStorage.getItem('token'); return t ? { Authorization: 'Bearer '+t } : {}; }

export default function Admin(){
  const [articles, setArticles] = useState([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title:'', summary:'', content:'', category:'General', published:false, image:null });

  const nav = useNavigate();

  useEffect(()=>{ load() },[]);

  async function load(){
    try {
      const r = await API.get('/articles', { params: { per: 200 }});
      setArticles(r.data.data);
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.removeItem('token');
        nav('/login');
      }
    }
  }

  const uploadAndCreate = async () => {
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('summary', form.summary);
    fd.append('content', form.content);
    fd.append('category', form.category);
    fd.append('published', form.published ? 'true' : 'false');
    if (form.image) fd.append('image', form.image);
    await API.post('/articles', fd, { headers: authHeader() });
    setCreating(false);
    setForm({ title:'', summary:'', content:'', category:'General', published:false, image:null });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete?')) return;
    await API.delete('/articles/'+id, { headers: authHeader() });
    load();
  };

  const logout = ()=> { localStorage.removeItem('token'); nav('/login'); }

  return (
    <div style={{maxWidth:980, margin:'0 auto', padding:20}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Admin Dashboard</h2>
        <div><button onClick={logout}>Logout</button></div>
      </header>

      <div style={{marginTop:12}}>
        <button onClick={()=>setCreating(true)}>New Article</button>
      </div>

      {creating && (
        <div style={{border:'1px solid #ddd', padding:12, marginTop:12}}>
          <input placeholder='Title' value={form.title} onChange={e=>setForm({...form, title:e.target.value})} /><br/>
          <input placeholder='Summary' value={form.summary} onChange={e=>setForm({...form, summary:e.target.value})} /><br/>
          <input placeholder='Category' value={form.category} onChange={e=>setForm({...form, category:e.target.value})} /><br/>
          <textarea placeholder='Content (HTML allowed, sanitized)' value={form.content} onChange={e=>setForm({...form, content:e.target.value})} rows={8} /><br/>
          <input type='file' onChange={e=>setForm({...form, image: e.target.files[0]})} /><br/>
          <label><input type='checkbox' checked={form.published} onChange={e=>setForm({...form, published:e.target.checked})}/> Publish</label><br/>
          <button onClick={uploadAndCreate}>Save</button> <button onClick={()=>setCreating(false)}>Cancel</button>
        </div>
      )}

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:16}}>
        {articles.map(a=> (
          <div key={a._id} style={{border:'1px solid #eee', padding:8}}>
            <div style={{fontWeight:700}}>{a.title}</div>
            <div style={{fontSize:12, color:'#666'}}>{a.category} • {new Date(a.createdAt).toLocaleString()}</div>
            <div style={{marginTop:8}}>
              <button onClick={()=>remove(a._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
