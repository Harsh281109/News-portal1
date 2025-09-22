import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

export default function Article(){
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  useEffect(()=> {
    API.get(`/articles/${slug}`).then(r=>setArticle(r.data)).catch(()=>setArticle(null));
  },[slug]);
  if (!article) return <div style={{padding:20}}>Loading...</div>;
  return (
    <div style={{maxWidth:760, margin:'0 auto', padding:20}}>
      <Link to="/">← Back</Link>
      <h1 style={{fontSize:28}}>{article.title}</h1>
      <div style={{color:'#666', marginBottom:8}}>{new Date(article.createdAt).toLocaleString()}</div>
      {article.imageUrl && <img src={`${(process.env.REACT_APP_API_URL||'http://localhost:4000').replace('/api','')}${article.imageUrl}`} alt="" style={{width:'100%', marginTop:12}} />}
      <div style={{marginTop:16}} dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  )
}
