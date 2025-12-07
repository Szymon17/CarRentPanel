import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "./pages/Navigation/Navigation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navigation />}>
          <Route path="/" element={<div>elo</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
