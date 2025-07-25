import { ComponentProps, ReactNode } from "react";

export interface InputInterface extends ComponentProps<'input'> {
  textLabel?: string,
  icon?: ReactNode,
  iconLeft?: ReactNode,
  textError?: ReactNode,
  error?: any,
  onClickButton?: () => void,
  removerFile?: () => void,
  buttonRight?: ReactNode,
  styleLabel?: string,
  fraseInputFile?: string,
  requiredItem?: boolean,
}