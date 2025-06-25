import { useSelector } from "react-redux";
import { api } from "./api";
import { useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation'
import { UsuarioConsultaType } from "@/types/UsuariosType";

export function AuthUser() {
  const token: string = useSelector((state: any) => state.userReducer.token);
  const user: UsuarioConsultaType = useSelector((state: any) => state.userReducer);
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (token != null) {
      api.defaults.headers.common["Authorization"] = "Bearer " + token;

      if (pathname == '/analisarRelatos' || pathname == '/categorias' || pathname == '/relatorio' || pathname == '/relatos') {
        if (!user.usmaster) {
          router.push('/home')
        }
      }
    } else {
      router.push('/')
    }
  }, [token, router, pathname]);
}

