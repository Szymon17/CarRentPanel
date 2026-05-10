import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "./pages/Navigation/Navigation";
import SignIn from "./pages/SignIn/SignIn";
import AuthProvider from "./context/Auth.context.tsx";
import { ToastContainer } from "react-toastify";
import Cars from "./pages/Cars/Cars.tsx";
import Car from "./pages/Car/Car.tsx";
import Orders from "./pages/Orders/Orders.tsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index path="/signIn" element={<SignIn />} />

          <Route element={<Navigation />}>
            <Route path="/" index element={<div></div>} />
            <Route path="cars" element={<Cars />} />
            <Route path="cars/car" element={<Car />} />
            <Route path="cars/create" element={<Car />} />

            <Route path="Orders" element={<Orders />} />
          </Route>
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
