import Loader from "../Loader/Loader.component";
import "./Button.style.sass";
import { useState, type FC, type ButtonHTMLAttributes, type MouseEvent, type MouseEventHandler, type ReactNode } from "react";

enum BUTTON_TYPES {
  STANDARD = "primary",
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  fn: (e: MouseEvent) => Promise<void>;
  type?: BUTTON_TYPES;
};

type LoadingState = "idle" | "loading";

const Button: FC<Props> = ({ children, fn, type = BUTTON_TYPES.STANDARD, className, ...standardAttributes }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");

  const clickHandler: MouseEventHandler<HTMLButtonElement> = async e => {
    setLoadingState("loading");
    await fn(e);
    setLoadingState("idle");
  };

  const baseClass = `custom-button btn-${type}`;
  const finalClassName = className ? `${baseClass} ${className}` : baseClass;

  return (
    <button {...standardAttributes} onClick={clickHandler} className={finalClassName}>
      {loadingState === "idle" ? children : <Loader />}
    </button>
  );
};

export default Button;
