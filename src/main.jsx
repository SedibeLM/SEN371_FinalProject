/* Debug: prove main.jsx runs */

console.log("[MAIN] executing");

document.getElementById('debug')?.insertAdjacentText('beforeend', " → [MAIN]");

import './index.css'

/* React mount */

import React from 'react'

import ReactDOM from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom'

import App from './App'

const rootEl = document.getElementById('root');

console.log("[MAIN] found #root?", !!rootEl);

if (!rootEl) throw new Error("No #root div in index.html");

ReactDOM.createRoot(rootEl).render(
<React.StrictMode>
<BrowserRouter>
<App />
</BrowserRouter>
</React.StrictMode>

);

console.log("[MAIN] after render()");
 