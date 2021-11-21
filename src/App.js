import "./App.css";
import Topbar from "./components/TopBar/Topbar";
import Sidebar from "./components/SideBar/Sidebar";
import Home from "./pages/Home/Home";

function App() {
  return (
    <div>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Home />
      </div>
    </div>
  );
}

export default App;
