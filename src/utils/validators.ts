/**
 * Valida se um email é válido
 * @param email - Email a ser validado
 * @returns true se o email for válido, false caso contrário
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

/**
 * Valida se um nome completo é válido
 * @param name - Nome a ser validado
 * @returns true se o nome for válido, false caso contrário
 */
export const validateFullName = (name: string): boolean => {
  // Mínimo 3 caracteres, apenas letras e espaços
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,}$/
  return nameRegex.test(name)
}

/**
 * Valida se um CEP é válido
 * @param cep - CEP a ser validado
 * @returns true se o CEP for válido, false caso contrário
 */
export const validateCEP = (cep: string): boolean => {
  const cepLimpo = cep.replace(/\D/g, '')
  return cepLimpo.length === 8
} 