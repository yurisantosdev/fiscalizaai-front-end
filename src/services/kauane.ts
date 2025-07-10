import { api } from './api'

export async function enviarMensagemKauane(mensagem: string, historico: { autor: 'user' | 'gpt', texto: string }[]) {
  const response = await api.post('/kauane/chat', { mensagem, historico })
  return response.data
} 