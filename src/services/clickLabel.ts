
/**
 * Função que simula um clique em um elemento label.
 * - Encontra o elemento label pelo atributo `for` e simula um clique nele.
 *
 * @param {string} htmlFor - O valor do atributo `for` do elemento label.
 * @returns {void}
 * 
 * @autor Yuri 🇧🇷
 */
export function CLickLabel(htmlFor: string) {
  const label = document.querySelector(
    `label[for="${htmlFor}"]`
  ) as HTMLLabelElement
  label?.click()

  return
}