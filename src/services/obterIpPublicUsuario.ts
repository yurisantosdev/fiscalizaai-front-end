export async function obterIpPublico(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    if (!response.ok) {
      throw new Error('Falha ao buscar o IP')
    }
    const data = await response.json()
    return data.ip
  } catch (error) {
    return ''
  }
}