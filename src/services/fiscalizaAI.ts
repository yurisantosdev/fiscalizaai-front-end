import { api } from './api'

export async function enviarMensagemFiscalizaAI(mensagem: string, historico: { autor: 'user' | 'gpt', texto: string }[]) {
  const response = await api.post('/fiscalizaAI/chat', { mensagem, historico })
  return response.data
} 