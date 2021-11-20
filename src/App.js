import "./App.css";
import Topbar from "./components/TopBar/Topbar";
import Sidebar from "./components/SideBar/Sidebar";

function App() {
  return (
    <div>
      <Topbar />
      <div className="container">
        <Sidebar />
        <div className="content">
          Contents
        </div>
      </div>
    </div>
  );
}

export default App;
