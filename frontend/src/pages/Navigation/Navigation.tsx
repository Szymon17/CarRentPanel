import "./Navigations.sass";
import { Outlet } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="navigation">
      <div>Navigation</div>
      <Outlet />
    </div>
  );
};

export default Navigation;
