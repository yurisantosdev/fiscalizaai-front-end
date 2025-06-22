import { ReactNode } from "react"

export interface BaseLayoutInterface {
  children: ReactNode
  title?: string
  loading?: boolean
  showBackButton?: boolean
  backButtonPath?: string
  backButtonText?: string
  extraHeaderContent?: ReactNode
  buttonVoltar?: boolean
  styleBase?: boolean
  menu?: boolean
  adicionarItens?: boolean,
  extraComponentLeft?: ReactNode,
  extraComponentRigth?: ReactNode,
  description?: string,
}
