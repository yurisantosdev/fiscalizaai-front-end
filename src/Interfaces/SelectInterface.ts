import { DetailedHTMLProps, ReactNode, SelectHTMLAttributes } from 'react'

export interface SelectInterface extends Omit<DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, 'type'> {
  icon?: ReactNode;
  iconRight?: ReactNode;
  iconRightFuntion?: () => void;
  textLabel?: string;
  textError?: ReactNode;
  error?: any;
  onClickButton?: () => void;
  buttonRight?: ReactNode;
  styleLabel?: string;
  requiredItem?: boolean;
  options: Array<{
    value: string;
    label: string;
    description?: string;
  }>
}