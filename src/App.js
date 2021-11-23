import "./App.css";
import Topbar from "./components/TopBar/Topbar";
import Sidebar from "./components/SideBar/Sidebar";
import Home from "./pages/Home/Home";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import UserList from "./pages/UserList/UserList";
import User from "./pages/User/User";

function App() {
  return (
    <BrowserRouter>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:userId" element={<User />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
