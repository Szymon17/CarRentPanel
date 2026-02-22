import "./Input.style.sass";
import { type Dispatch, type FC, type SetStateAction } from "react";

type Props = {
  label: string;
  state: [string, Dispatch<SetStateAction<string>>];
  type?: "text" | "password";
};

const Input: FC<Props> = ({ label, state, type = "text" }) => {
  return (
    <div className="cutom-input">
      <label className={`${state[0].length > 0 ? "active" : ""}`}>{label}</label>
      <input type={type} value={state[0]} onChange={e => state[1](e.target.value)} />
    </div>
  );
};

export default Input;
