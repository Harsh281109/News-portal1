import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function Home(){
  const [articles, setArticles] = useState([]);
  useEffect(()=> {
    API.get('/articles').then(r=>setArticles(r.data.data)).catch(()=>setArticles([]));
  },[]);
  return (
    <div style={{maxWidth:980, margin:'0 auto', padding:20}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{fontSize:28}}>DailyNews</h1>
        <div><Link to="/login">Admin</Link></div>
      </header>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:12}}>
        {articles.map(a=> (
          <article key={a._id} style={{border:'1px solid #ddd', padding:12, borderRadius:6}}>
            {a.imageUrl && <img src={`${(process.env.REACT_APP_API_URL||'http://localhost:4000').replace('/api','')}${a.imageUrl}`} alt="" style={{width:'100%', maxHeight:200, objectFit:'cover'}} />}
            <h2 style={{fontSize:18}}><Link to={`/article/${a.slug}`}>{a.title}</Link></h2>
            <p style={{color:'#333'}}>{a.summary}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
