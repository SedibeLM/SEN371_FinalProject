import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getThread, getPostsByThread, createPost, getUserProfile } from "../utils/storage";

function PostForm({ threadId, onPostCreated }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content) return;
    setSubmitting(true);
    const res = await createPost({ content, thread_id: Number(threadId) });
    setSubmitting(false);
    if (res.ok) {
      onPostCreated(res.data);
      setContent("");
    } else {
      alert(`Error creating post: ${res.msg}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{marginTop: 20}}>
      <textarea
        className="input"
        rows={4}
        placeholder="Write a reply..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button className="btn btn-primary" type="submit" disabled={submitting} style={{marginTop: 10}}>
        {submitting ? "Posting..." : "Post Reply"}
      </button>
    </form>
  );
}

export default function ThreadDetail() {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [threadData, postsData, userProfile] = await Promise.all([
        getThread(threadId),
        getPostsByThread(threadId),
        getUserProfile()
      ]);
      setThread(threadData);
      setPosts(postsData || []);
      setProfile(userProfile);
      setLoading(false);
    };
    fetchData();
  }, [threadId]);

  function handlePostCreated(newPost) {
    // A bit of a hack to get the author's email without re-fetching
    const newPostWithAuthor = { ...newPost, author: { email: profile.email } };
    setPosts(currentPosts => [...currentPosts, newPostWithAuthor]);
  }

  if (loading) {
    return <div className="page"><h1>Loading Thread...</h1></div>;
  }

  if (!thread) {
    return <div className="page"><h1>Thread not found</h1></div>;
  }

  return (
    <div className="page">
      <h1>{thread.title}</h1>
      <div className="card" style={{maxWidth: 900, margin: "20px auto"}}>
        {posts.map(post => (
          <div key={post.post_id} style={{borderBottom: "1px solid #eee", padding: "15px 0"}}>
            <div style={{display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)"}}>
              <span>{post.author?.email || '...'}</span>
              <span>{new Date(post.created_at).toLocaleString()}</span>
            </div>
            <div style={{marginTop: 8}}>{post.content}</div>
          </div>
        ))}
        {posts.length === 0 && <div style={{color:"var(--muted)"}}>No posts yet.</div>}
        {profile && <PostForm threadId={threadId} onPostCreated={handlePostCreated} />}
      </div>
    </div>
  );
}
