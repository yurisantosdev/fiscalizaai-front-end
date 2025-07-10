import { api } from './api'

export async function enviarMensagemKauane(mensagem: string) {
  const response = await api.post('/kauane/chat', { mensagem })
  return response.data
} 