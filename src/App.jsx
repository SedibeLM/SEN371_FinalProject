import { Routes, Route, Navigate } from "react-router-dom";

import Overview from "./pages/Overview"; // keep this page simple

export default function App(){

  return (
<Routes>
<Route path="/" element={<Navigate to="/app/overview" replace/>}/>
<Route path="/app/overview" element={<Overview/>}/>
<Route path="*" element={<Navigate to="/app/overview" replace/>}/>
</Routes>

  );

}
 