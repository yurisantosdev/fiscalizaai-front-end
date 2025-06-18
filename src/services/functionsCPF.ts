/**
 * Formata um CPF para o formato XXX.XXX.XXX-XX.
 *
 * @param {string} cpf - O CPF a ser formatado.
 * @returns {string} O CPF formatado.
 *
 * @autor Yuri 🇧🇷
 */
export function FormatCPF(cpf: string) {
  const cpfNumerico = cpf.replace(/\D/g, '')

  if (cpfNumerico.length >= 3) {
    const cpfFormatado = `${cpfNumerico.slice(0, 3)}.${cpfNumerico.slice(
      3,
      6
    )}.${cpfNumerico.slice(6, 9)}-${cpfNumerico.slice(9)}`
    return cpfFormatado
  }

  return cpf
}

/**
 * Valida um CPF.
 *
 * @param {string} cpf - O CPF a ser validado.
 * @returns {boolean} `true` se o CPF for válido, `false` caso contrário.
 *
 * @autor Yuri 🇧🇷
 */
export function ValidCPF(cpf: string): boolean {
  const cpfNumerico = cpf.replace(/\D/g, '')

  if (cpfNumerico.length !== 11) return false

  if (/^(\d)\1{10}$/.test(cpfNumerico)) return false

  const calcVerificador = (
    base: string,
    multiplicadorInicial: number
  ): number => {
    let soma = 0

    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base[i]) * (multiplicadorInicial - i)
    }

    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }

  const digito1 = calcVerificador(cpfNumerico.slice(0, 9), 10)
  const digito2 = calcVerificador(cpfNumerico.slice(0, 10), 11)

  return (
    digito1 === parseInt(cpfNumerico[9]) &&
    digito2 === parseInt(cpfNumerico[10])
  )
}
