import "./Navigations.sass";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/Auth.context";
import PersonIcon from "bootstrap-icons/icons/person-circle.svg?react";
import PowerIcon from "bootstrap-icons/icons/power.svg?react";
import nav_items from "./nav-items";

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(nav_items[0].name);

  useEffect(() => {
    const current = nav_items.find(icon => icon.link !== "/" && location.pathname.startsWith(icon.link));

    if (current) setActiveTab(current.name);
  }, [location.pathname]);

  if (user.email)
    return (
      <>
        <div className="navigation">
          {nav_items.map((props, index) => (
            <Link key={index} onClick={() => setActiveTab(props.name)} className={`tab${activeTab === props.name ? " active" : ""}`} to={props.link}>
              <props.icon width={20} height={20} />
              <span className="tab__name">{props.name}</span>
            </Link>
          ))}
        </div>
        <div className="content">
          <div className="content_header">
            <h1>{activeTab}</h1>
            <div className="user_snapshot">
              <PersonIcon width={30} height={30} />
              <div className="user_snapshot__info">
                <span className="welcome">Welcome,</span>
                <span>{user.email.split("@")[0] ?? ""}</span>
              </div>
              <PowerIcon role="button" onClick={logout} className="shutdown" width={25} height={25} />
            </div>
          </div>

          <div className="content_body">
            <Outlet />
          </div>
        </div>
      </>
    );
};

export default Navigation;
