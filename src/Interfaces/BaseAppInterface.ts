import { ComponentProps, ReactNode } from "react";

export interface BaseAppInterface extends ComponentProps<'div'> {
  children?: ReactNode;
  loading: boolean,
  styleBase?: boolean,
  kauaneAi?: boolean,
  menu?: boolean,
  extraComponentTitle?: ReactNode,
  feedbacks?: boolean,
}
