import { useEffect } from "react";
import "./Button.css";

export enum ButtonType {
  main = "main",
  secondary = "secondary",
}

export interface ButtonProps {
  onClick: (e?: any) => void;
  children: any;
  type: ButtonType;
  disabled?: boolean;
}

export default function Button(props: ButtonProps) {
  let className = `${props.type}-button`;
  if (props.disabled) {
    className += ` disabled`;
  }
  const shouldFireClickEvents = (e: any) => {
    if (!props.disabled) props.onClick(e);
  };
  return (
    <button type="button" onClick={shouldFireClickEvents} className={className}>
      {props.children}
    </button>
  );
}
