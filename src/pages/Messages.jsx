import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getUserProfile, getConversations, getPrivateMessages, sendPrivateMessage } from "../utils/storage";

export default function Messages() {
  const [profile, setProfile] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      if (userProfile) {
        const convos = await getConversations(userProfile.auth_id);
        setConversations(convo => {
            // a bit of a hack to prevent duplicate conversations
            const existingKeys = new Set(convo.map(c => c.conversation_key));
            const newConvos = convos.filter(c => !existingKeys.has(c.conversation_key));
            return [...convo, ...newConvos];
        });
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const recipientId = searchParams.get("recipientId");
    const topicId = searchParams.get("topicId");
    if (recipientId && topicId && profile) {
        const key = [profile.auth_id, recipientId].sort().join('_') + `_${topicId}`;
        setSelectedConversation(key);
        // Remove the query params from the URL
        navigate("/app/messages", { replace: true });
    }
  }, [searchParams, profile, navigate]);


  useEffect(() => {
    if (!selectedConversation) return;
    const fetchMessages = async () => {
      const msgs = await getPrivateMessages(selectedConversation);
      setMessages(msgs);
    };
    fetchMessages();
  }, [selectedConversation]);

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage || !selectedConversation) return;

    const [user1, user2, topicId] = selectedConversation.split('_');
    const recipientId = profile.auth_id === user1 ? user2 : user1;

    const res = await sendPrivateMessage({
      recipient_id: recipientId,
      topic_id: Number(topicId),
      content: newMessage,
    });

    if (res.ok) {
      setMessages(prev => [...prev, res.data]);
      setNewMessage("");
    } else {
      alert("Error sending message.");
    }
  }

  return (
    <div className="page">
      <h1>Private Messages</h1>
      <div className="grid" style={{gridTemplateColumns: "320px 1fr", gap: 20}}>
        <div className="card">
          <h3 className="card-title">Conversations</h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div style={{display: "grid", gap: 8}}>
              {conversations.map(convo => (
                <button
                  key={convo.conversation_key}
                  className={`btn ${selectedConversation === convo.conversation_key ? 'btn-primary' : 'btn-ghost'}`}
                  style={{justifyContent: "flex-start", textAlign: 'left'}}
                  onClick={() => setSelectedConversation(convo.conversation_key)}
                >
                  <div><b>{convo.other_user_email}</b></div>
                  <div style={{fontSize: 12}}>{convo.topic_title}</div>
                  <div style={{fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {convo.last_message_content}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          {selectedConversation ? (
            <>
              <div style={{minHeight: 400, border: "1px solid var(--border)", borderRadius: 10, padding: 12, background: "#fff", marginBottom: 10, overflowY: 'auto'}}>
                {messages.map(msg => (
                  <div key={msg.message_id} style={{marginBottom: 10}}>
                    <div style={{fontSize: 12, color: "var(--muted)"}}>
                      <b>{msg.sender.email}</b> at {new Date(msg.sent_at).toLocaleString()}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                ))}
                {messages.length === 0 && <div style={{color: 'var(--muted)'}}>No messages yet.</div>}
              </div>
              <form onSubmit={handleSendMessage} style={{display: "flex", gap: 10}}>
                <input
                  className="input"
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">Send</button>
              </form>
            </>
          ) : (
            <div style={{textAlign: 'center', color: 'var(--muted)', paddingTop: 50}}>
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
