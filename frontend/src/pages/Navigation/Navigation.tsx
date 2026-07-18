import "./Navigations.sass";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/Auth.context";
import PersonIcon from "bootstrap-icons/icons/person-circle.svg?react";
import PowerIcon from "bootstrap-icons/icons/power.svg?react";
import MenuIcon from "bootstrap-icons/icons/list.svg?react";
import nav_items from "./nav-items";

const NAV_KEY = "nav_collapsed";

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(nav_items[0].name);
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem(NAV_KEY);
    if (stored !== null) return stored === "true";
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const current = nav_items.find(item => item.link !== "/" && location.pathname.startsWith(item.link));
    if (current) setActiveTab(current.name);
  }, [location.pathname]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
      localStorage.setItem(NAV_KEY, "true");
    }
  }, [location.pathname]);

  const toggle = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem(NAV_KEY, String(next));
      return next;
    });
  };

  if (!user.email) return null;

  return (
    <>
      {!collapsed && <div className="nav-backdrop" onClick={toggle} />}
      <div className={`navigation${collapsed ? " navigation--collapsed" : ""}`}>
        {nav_items.map((item, index) => (
          <Link
            key={index}
            onClick={() => setActiveTab(item.name)}
            className={`tab${activeTab === item.name ? " active" : ""}`}
            to={item.link}
            title={item.name}
          >
            <item.icon width={18} height={18} />
            <span className="tab__name">{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="content">
        <div className="content_header">
          <div className="content_header__left">
            <button className="nav-toggle-btn" onClick={toggle} aria-label="Toggle navigation">
              <MenuIcon width={18} height={18} />
            </button>
            <h1>{activeTab}</h1>
          </div>
          <div className="user_snapshot">
            <PersonIcon width={26} height={26} />
            <div className="user_snapshot__info">
              <span className="welcome">Welcome,</span>
              <span>{user.email.split("@")[0] ?? ""}</span>
            </div>
            <PowerIcon role="button" onClick={logout} className="shutdown" width={20} height={20} />
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
