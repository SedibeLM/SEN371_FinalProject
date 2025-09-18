import { useEffect, useState } from 'react'
import { getAuthUser, listTopics, subscribeTopic } from '../utils/storage'

export default function StudentDashboard(){
  const user = getAuthUser()
  const [topics, setTopics] = useState([])

  useEffect(()=>{ setTopics(listTopics()) }, [])

  function onSubscribe(id){
    subscribeTopic({ topicId: Number(id), studentId: user.id })
    alert('Subscribed')
  }

  return (
    <div className="container grid" style={{gap:24}}>
      <h1>Student Dashboard</h1>
      <div className="grid cols-3">
        {topics.map(t => (
          <div key={t.id} className="card">
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <strong>{t.title}</strong>
              <span className="badge">{t.moduleCode}</span>
            </div>
            <div className="row" style={{marginTop:12}}>
              <a className="btn secondary" href={`/topics/${t.id}`}>Open</a>
              <button className="btn" data-test="subscribe" onClick={()=>onSubscribe(t.id)}>Subscribe</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
