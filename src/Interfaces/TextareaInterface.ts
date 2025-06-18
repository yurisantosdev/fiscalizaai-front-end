import { ComponentProps, ReactNode } from "react";

export interface TextareaInterface extends ComponentProps<'textarea'> {
  textLabel?: string;
  icon?: any;
  textError?: ReactNode;
  error?: any;
  onClickButton?: () => void;
  buttonRight?: ReactNode;
  styleLabel?: string;
  requiredItem?: boolean;
}