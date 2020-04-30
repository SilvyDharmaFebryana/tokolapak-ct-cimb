import React, { CSSProperties } from "react";
import "./Button.css";

type ButtonTypes = {
  type?: "contained" | "outlined" | "textual" | "auth";
  children: any;
  style?: CSSProperties;
  className?: string;
  onClick?: any;
  id: string;
};

const ButtonUI = (props: ButtonTypes) => {
  let { type, children, style, className, onClick, id } = props;

  type = type || "contained";

  return (
    <div
      style={style}
      onClick={onClick}
      className={`custom-btn custom-btn-${type} ${className}`}
      id={id}
    >
      {children}
    </div>
  );
};

export default ButtonUI;


