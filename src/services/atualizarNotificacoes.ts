import { UsuarioConsultaType } from '@/types/UsuariosType'
import { store } from '@/redux/store'
import { getNotificacoes } from '@/store/Notificacoes'
import { setNotificacoes } from '@/redux/notificacoes/actions'

export async function atualizarNotificacoes() {
  const state = store.getState()
  const user: UsuarioConsultaType = state.userReducer

  if (user.uscodigo) {
    const reponse = await getNotificacoes({ uscodigo: user.uscodigo })

    if (reponse !== undefined) {
      store.dispatch(setNotificacoes(reponse.notificacoes))
    }
  }
}