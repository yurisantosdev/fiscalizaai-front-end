/**
 * Formata um CEP para o padrão 00000-000
 * @param cep - CEP a ser formatado
 * @returns CEP formatado
 */
export const formatCEP = (cep: string): string => {
  const cepLimpo = cep.replace(/\D/g, '')
  return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2')
}

/**
 * Consulta um CEP na API ViaCEP
 * @param cep - CEP a ser consultado
 * @returns Objeto com os dados do endereço
 */
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