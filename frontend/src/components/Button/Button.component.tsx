import Loader from "../Loadeer/Loader.component";
import "./Button.style.sass";
import { useState, type FC, type HTMLAttributes, type MouseEvent, type MouseEventHandler, type ReactNode } from "react";

enum BUTTON_TYPES {
  STANDARD = "primary",
}

type Props = HTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  fn: (e: MouseEvent) => Promise<void>;
  type?: BUTTON_TYPES;
};

type LoadingState = "idle" | "loading";

const Button: FC<Props> = ({ children, fn, type = BUTTON_TYPES.STANDARD, ...standardAttributes }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");

  const clickHandler: MouseEventHandler<HTMLButtonElement> = async e => {
    setLoadingState("loading");
    await fn(e);
    setLoadingState("idle");
  };

  return (
    <button {...standardAttributes} onClick={clickHandler} className={`custom-button btn-${type}`}>
      {loadingState === "idle" ? children : <Loader />}
    </button>
  );
};

export default Button;
