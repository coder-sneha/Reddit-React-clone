import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import HomePage from "./component/home/homepage";
import { Routes, Route } from 'react-router-dom';
import Subcription from "./component/home/subscription";
import Post from "./component/home/post";


function App() {

  

  return (
    <div className="App">
       <ToastContainer />
       <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/subscription" element={<Subcription />} />
        <Route path="/searchPost" element={<Post />} />
      </Routes>
     
    </div>
  );
}

export default App;
