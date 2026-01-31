import { createContext, useEffect, useState, type Dispatch, type FC, type ReactNode, type SetStateAction } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type UserContextType = { user: User; setUser: Dispatch<SetStateAction<User>>; logout: () => void };
type User = {
  email: string;
};

export const AuthContext = createContext<UserContextType>({ user: { email: "" }, setUser: () => null, logout: () => null });

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ email: "" });

  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    const serverUrl = import.meta.env.VITE_API_URL;

    try {
      await fetch(`${serverUrl}/auth/logout`, { credentials: "include" });
      setUser({ email: "" });
      navigate("/signIn");
    } catch (error) {
      console.error(error);
    }
  };

  const HttpAuthUser = async () => {
    if (location.pathname === "/signIn") return;

    const serverUrl = import.meta.env.VITE_API_URL;

    try {
      const req = await fetch(`${serverUrl}/auth/me`, { credentials: "include" });
      const { message, ...userProps } = await req.json();

      setUser(userProps);
    } catch (error) {
      console.error(error);
      navigate("/signIn");
    }
  };

  useEffect(() => {
    HttpAuthUser();
  }, []);

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
