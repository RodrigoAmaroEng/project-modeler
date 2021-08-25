import "./Button.css";

export enum ButtonType {
  main = "main",
  secondary = "secondary",
}

export interface BaseButtonProps {
  onClick: (e?: any) => void;
  children: any;
}

export interface BaseButtonPropsWithClass extends BaseButtonProps {
  className?: string;
}

export interface ButtonProps extends BaseButtonPropsWithClass {
  type: ButtonType;
  disabled?: boolean; 
}

export default function Button(props: ButtonProps) {
  let className = `${props.type}-button`;
  if (props.disabled) {
    className += ` disabled`;
  }
  if (props.className) {
    className += ` ${props.className}`;
  }
  const shouldFireClickEvents = (e: any) => {
    e.preventDefault();
    if (!props.disabled) props.onClick(e);
  };
  return (
    <div onClick={shouldFireClickEvents} className={className}>
      {props.children}
    </div>
  );
}

export function MainButton(props: BaseButtonPropsWithClass) {
  return <Button {...props} type={ButtonType.main} className={props.className}>{props.children}</Button>
}
export function SecondaryButton(props: BaseButtonPropsWithClass) {
  return <Button {...props} type={ButtonType.secondary} className={props.className}>{props.children}</Button>
}

export function SquareMainButton(props: BaseButtonProps) {
  return <MainButton {...props} className="square">{props.children}</MainButton>
}