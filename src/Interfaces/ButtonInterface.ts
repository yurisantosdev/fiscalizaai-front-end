import { ComponentProps, ReactNode } from "react";

export interface ButtonInterface extends ComponentProps<'button'> {
  title?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export interface ButtonIconInterface extends ComponentProps<'button'> {
  icon: ReactNode;
}