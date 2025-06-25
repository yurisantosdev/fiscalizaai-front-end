export const formatCEP = (cep: string): string => {
  const cepLimpo = cep.replace(/\D/g, '')
  return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2')
}

export const consultarCEP = async (cep: string) => {
  const cepLimpo = cep.replace(/\D/g, '')

  if (cepLimpo.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (!data.erro) {
        return {
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf
        }
      }
      return null
    } catch (error) {
      console.error('Erro ao consultar CEP:', error)
      return null
    }
  }
  return null
} 