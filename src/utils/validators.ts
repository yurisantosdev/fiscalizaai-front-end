export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

export const validateFullName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,}$/
  return nameRegex.test(name)
}

export const validateCEP = (cep: string): boolean => {
  const cepLimpo = cep.replace(/\D/g, '')
  return cepLimpo.length === 8
} 