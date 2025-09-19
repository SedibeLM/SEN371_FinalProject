const K = {
  auth: "cl_auth_user",
  topics: "cl_topics",
  materials: "cl_materials",
  messages: "cl_messages",
  subs: "cl_subscriptions", // array of {studentEmail, topicId}
};

// ---------- Seed data ----------
function seedOnce() {
  if (!localStorage.getItem(K.topics)) {
    const topics = [
      { id: 1, title: "Scrum Intro", description: "Agile & Scrum basics", tutorEmail: "tutor@gmail.com" },
      { id: 2, title: "Design Patterns", description: "GoF essentials", tutorEmail: "tutor@gmail.com" }
    ];
    localStorage.setItem(K.topics, JSON.stringify(topics));
  }
  if (!localStorage.getItem(K.materials)) {
    localStorage.setItem(K.materials, JSON.stringify([]));
  }
  if (!localStorage.getItem(K.messages)) {
    localStorage.setItem(K.messages, JSON.stringify([]));
  }
  if (!localStorage.getItem(K.subs)) {
    localStorage.setItem(K.subs, JSON.stringify([]));
  }
}
seedOnce();

// ---------- Auth ----------
const USERS = [
  { email: "student@gmail.com", password: "1234", role: "STUDENT", name:"Student One" },
  { email: "tutor@gmail.com",   password: "1234", role: "TUTOR",   name:"Tutor One" },
];

export function loginUser(email, password) {
  const u = USERS.find(x => x.email === email && x.password === password);
  if (!u) return false;
  localStorage.setItem(K.auth, JSON.stringify({ email:u.email, role:u.role, name:u.name }));
  return true;
}
export function getAuthUser() {
  try { return JSON.parse(localStorage.getItem(K.auth)) || null; } catch { return null; }
}
export function logoutUser() { localStorage.removeItem(K.auth); }

// ---------- Topics ----------
export function getTopics() {
  return JSON.parse(localStorage.getItem(K.topics)) || [];
}
export function createTopic({ title, description }, tutorEmail) {
  const list = getTopics();
  const id = list.length ? Math.max(...list.map(t=>t.id))+1 : 1;
  const t = { id, title, description, tutorEmail };
  localStorage.setItem(K.topics, JSON.stringify([...list, t]));
  return t;
}

// ---------- Materials ----------
export function getMaterials(topicId) {
  const all = JSON.parse(localStorage.getItem(K.materials)) || [];
  return typeof topicId === "number" ? all.filter(m => m.topicId === topicId) : all;
}
export function addMaterial({ topicId, title, url }) {
  const all = getMaterials();
  const id = all.length ? Math.max(...all.map(m=>m.id))+1 : 1;
  const m = { id, topicId, title, contentUrl:url };
  localStorage.setItem(K.materials, JSON.stringify([...all, m]));
  return m;
}

// ---------- Messages ----------
export function getMessages(topicId) {
  const all = JSON.parse(localStorage.getItem(K.messages)) || [];
  return typeof topicId === "number" ? all.filter(x=>x.topicId===topicId) : all;
}
export function sendMessage({ topicId, content, senderEmail }) {
  const all = getMessages();
  const id = all.length ? Math.max(...all.map(m=>m.id))+1 : 1;
  const msg = { id, topicId, content, senderEmail, timestamp: Date.now() };
  localStorage.setItem(K.messages, JSON.stringify([...all, msg]));
  return msg;
}

// ---------- Subscriptions (Student) ----------
export function getSubscriptions(studentEmail) {
  const all = JSON.parse(localStorage.getItem(K.subs)) || [];
  return all.filter(x => x.studentEmail === studentEmail).map(x=>x.topicId);
}
export function toggleSubscription(studentEmail, topicId) {
  let all = JSON.parse(localStorage.getItem(K.subs)) || [];
  const has = all.some(x => x.studentEmail === studentEmail && x.topicId === topicId);
  all = has
    ? all.filter(x => !(x.studentEmail === studentEmail && x.topicId === topicId))
    : [...all, { studentEmail, topicId }];
  localStorage.setItem(K.subs, JSON.stringify(all));
  return !has;
}
export function setAuthUser(user) {
  // user = { email, role, name }
  localStorage.setItem("cl_auth_user", JSON.stringify(user));
}