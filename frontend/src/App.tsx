import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "./pages/Navigation/Navigation";
import SignIn from "./pages/SignIn/SignIn";
import AuthProvider from "./context/Auth.context.tsx";
import { ToastContainer } from "react-toastify";
import Cars from "./pages/Cars/Cars.tsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index path="/signIn" element={<SignIn />} />

          <Route element={<Navigation />}>
            <Route path="/" index element={<div>elo</div>} />
            <Route path="/cars" element={<Cars />} />
          </Route>
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
