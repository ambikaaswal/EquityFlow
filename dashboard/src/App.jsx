import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { UserProvider } from "./UserContext";
import UserGuard from "./UserGuard"
function App() {
  return (
    <>
    <UserProvider>
      <Routes>
        <Route path="/*" element={
          <UserGuard>
          <Home />
          </UserGuard>
          } />
      </Routes>
    </UserProvider>
    </>
  );
}

export default App;