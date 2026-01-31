import "./SingIn.sass";
import { useContext, useState } from "react";
import Input from "@/components/Input/Input.component";
import Button from "@/components/Button/Button.component";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/Auth.context";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const emailState = useState("");
  const passwordState = useState("");

  const tryLogin = async () => {
    if (!emailState[0] || !passwordState[0]) {
      toast.warning("Email and password cannot be empty");
      return;
    }

    const serverUrl = import.meta.env.VITE_API_URL;

    try {
      const req = await fetch(`${serverUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: emailState[0], password: passwordState[0] }),
      });

      const { message, ...user } = await req.json();

      if (req.ok && user) {
        setUser(user);
        navigate("/");
      } else if (req.status === 401) toast.error("Incorrect login data");
    } catch (error) {
      console.error;
    }
  };

  return (
    <div className="SignIn-page">
      <div className="SingIn">
        <h3>Welcome to CRP</h3>
        <span className="span">Administration panel</span>

        <div className="SingIn__inputs">
          <Input state={emailState} label={"Email"}></Input>
          <Input state={passwordState} label={"Password"}></Input>
          <Button fn={tryLogin}>Login</Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
