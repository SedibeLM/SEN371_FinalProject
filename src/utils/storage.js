// Mini localStorage "backend" so the app works without servers.

const KEYS = {
  users: 'cl_users',
  auth: 'cl_auth_user',
  topics: 'cl_topics',
  threads: 'cl_threads',
  messages: 'cl_messages',
};

const read = (k, fallback) => JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback));
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const nextId = (list) => (list.length ? Math.max(...list.map(x => x.id)) + 1 : 1);

// --- users & auth ---
export function getUsers(){ return read(KEYS.users, []) }
export function saveUsers(list){ write(KEYS.users, list) }

export function registerUser({firstName,lastName,email,password,role}){
  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already registered');
  }
  const user = { id: nextId(users), firstName, lastName, email, password, role, subscriptions:[] };
  users.push(user); saveUsers(users); write(KEYS.auth, user); return user;
}

export function loginUser(email, password){
  const u = getUsers().find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
  if (!u) throw new Error('Invalid email or password');
  write(KEYS.auth, u); return u;
}

export function getAuthUser(){ return read(KEYS.auth, null) }
export function logout(){ localStorage.removeItem(KEYS.auth) }

// --- topics & materials ---
export function listTopics(){ return read(KEYS.topics, []) }
export function getTopic(id){ return listTopics().find(t => t.id === Number(id)) || null }
export function createTopic({title, moduleCode, tutorId}){
  const topics = listTopics();
  const t = { id: nextId(topics), title, moduleCode, status:'OPEN', tutorId, materials:[] };
  topics.unshift(t); write(KEYS.topics, topics); return t;
}
export function uploadMaterial({topicId, type, fileName, sizeBytes}){
  const topics = listTopics();
  const t = topics.find(x => x.id === Number(topicId));
  if (!t) throw new Error('Topic not found');
  t.materials.push({ id: nextId(t.materials||[]), type, fileName, sizeBytes, createdAt:new Date().toISOString() });
  write(KEYS.topics, topics); return { message:'Material saved (mock)' };
}

// --- subscriptions ---
export function subscribeTopic({topicId, studentId}){
  const users = getUsers();
  const u = users.find(x => x.id === studentId);
  if (!u) throw new Error('User not found');
  if (!u.subscriptions.includes(topicId)) u.subscriptions.push(topicId);
  saveUsers(users); return { message:'Subscribed' };
}

// --- threads & messages ---
function threads(){ return read(KEYS.threads, []) }
function messages(){ return read(KEYS.messages, []) }
function saveThreads(x){ write(KEYS.threads, x) }
function saveMessages(x){ write(KEYS.messages, x) }

export function ensureThreadByTopic(topicId){
  const ths = threads();
  let th = ths.find(t => t.topicId === Number(topicId));
  if (!th){ th = { id: nextId(ths), topicId: Number(topicId) }; ths.push(th); saveThreads(ths); }
  return th;
}
export function listMessages(threadId){ return messages().filter(m => m.threadId === Number(threadId)) }
export function postMessage({threadId, authorId, content}){
  const list = messages();
  const msg = { id: nextId(list), threadId:Number(threadId), authorId, content:content.trim(), createdAt:new Date().toISOString() };
  list.push(msg); saveMessages(list); return msg;
}

// --- seed demo data on first run ---
(function seed(){
  if (getUsers().length === 0) {
    saveUsers([
      { id:1, firstName:'Tumi', lastName:'Tutor', email:'tutor@demo.com', password:'pass', role:'TUTOR', subscriptions:[] },
      { id:2, firstName:'Sindi', lastName:'Student', email:'student@demo.com', password:'pass', role:'STUDENT', subscriptions:[] },
    ]);
  }
  if (listTopics().length === 0) {
    write(KEYS.topics, [
      { id:1, title:'Scrum Intro', moduleCode:'SEN371', status:'OPEN', tutorId:1, materials:[] },
      { id:2, title:'Design Patterns', moduleCode:'SEN371', status:'OPEN', tutorId:1, materials:[] },
    ]);
  }
})();
