import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Options from "./Options";
import Checklist from "./Checklist";
import Feedback from "./Feedback";
import Plan from "./Plan";
import Budget from "./Budget";
import Destination from "./Destination";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/options" element={<Options />} />
        <Route path="/checklists" element={<Checklist />} />
        <Route path="/feedbacks" element={<Feedback />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/destination" element={<Destination />} />
      </Routes>
    </Router>
  );
};

export default App;
