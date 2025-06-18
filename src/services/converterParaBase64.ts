
/**
 * Converte um arquivo para uma string base64.
 * - Utiliza o FileReader para ler o arquivo e retornar sua representação em base64.
 *
 * @param {File} file - O arquivo a ser convertido.
 * @returns {Promise<string>} Retorna uma Promise que resolve com a string base64 do arquivo. 
 * 
 * @autor Yuri 🇧🇷
 */
export function converterParaBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}