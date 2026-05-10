import { type FC } from "react";

export enum BADGE_TYPES {
  PRIMARY = "primary",
  DANGER = "danger",
  OK = "ok",
  WARNING = "warning",
}

const Badge: FC<{ type: BADGE_TYPES; text: string }> = ({ type = BADGE_TYPES.PRIMARY, text }) => {
  return <span className={`badge badge--${type}`}>{text}</span>;
};

export default Badge;
