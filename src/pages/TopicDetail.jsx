import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAuthUser, getTopic, ensureThreadByTopic, listMessages, postMessage } from '../utils/storage'

export default function TopicDetail(){
  const { id } = useParams()
  const user = getAuthUser()
  const [topic, setTopic] = useState(null)
  const [thread, setThread] = useState(null)
  const [text, setText] = useState('')
  const [msgs, setMsgs] = useState([])

  useEffect(()=>{
    const t = getTopic(id); setTopic(t)
    const th = ensureThreadByTopic(id); setThread(th)
    setMsgs(listMessages(th.id))
  }, [id])

  function send(){
    if (!text.trim()) return
    postMessage({ threadId: thread.id, authorId: user.id, content: text })
    setText(''); setMsgs(listMessages(thread.id))
  }

  if (!topic) return <div className="container"><p>Topic not found.</p></div>

  return (
    <div className="container grid" style={{gap:16, maxWidth:800}}>
      <h1>{topic.title}</h1>

      <div className="card">
        <h2>New message</h2>
        <textarea className="input" data-test="message-input" rows="3" value={text} onChange={e=>setText(e.target.value)} placeholder="Write a message..."/>
        <div style={{marginTop:8}}>
          <button className="btn" data-test="send-message" onClick={send}>Send</button>
        </div>
      </div>

      <div className="card">
        <h2>Thread</h2>
        {msgs.length===0 ? <div style={{color:'#64748b'}}>No messages yet</div> : (
          <div className="grid">
            {msgs.slice().reverse().map(m => (
              <div key={m.id} style={{borderBottom:'1px solid #e2e8f0', paddingBottom:8}}>
                <div style={{fontSize:12, color:'#64748b'}}>{new Date(m.createdAt).toLocaleString()}</div>
                <div>{m.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
