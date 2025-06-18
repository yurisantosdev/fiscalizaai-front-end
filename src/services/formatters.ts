/**
 * Formata uma data e hora para o formato DD/MM/YYYY HH:MM.
 * 
 * @param {string} dataHora - A data e hora a ser formatada.
 * @returns {string} A data e hora formatada.
 * @autor Yuri 🇧🇷
 */
export function FormatarData(dataHora: string) {
  const data = new Date(dataHora);

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const hora = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');

  return `${dia}/${mes} ${hora}:${minutos}`;
}

/**
 * Converte uma data no formato DD-MM-YYYY para o formato DD/MM/YYYY.
 * 
 * @param {string} dataString - A data a ser convertida.
 * @returns {string} A data convertida para o formato DD/MM/YYYY.
 * @autor Yuri 🇧🇷
 */
export function ConverterDataBrasil(dataString: string) {
  const data = dataString.split('-');

  return `${data[2]}/${data[1]}/${data[0]}`;
}

/**
 * Converte uma data no formato DD-MM-YYYY para o formato DD/MM.
 * 
 * @param {string} dataString - A data a ser convertida.
 * @returns {string} A data convertida para o formato DD/MM.
 * @autor Yuri 🇧🇷
 */
export function ConverterDataBrasilSemAno(dataString: string) {
  const data = dataString.split('-');

  return `${data[2]}/${data[1]}`;
}

/**
 * Formata uma data e hora para o formato DD/MM/YYYY HH:MM.
 * 
 * @param {string} dataHoraStr - A data e hora a ser formatada.
 * @returns {string} A data e hora formatada.
 * @autor Yuri 🇧🇷
 */
export function FormatarDataHora(dataHoraStr: string) {
  const [data, hora] = dataHoraStr.split(' ')
  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano} ${hora}`
}

export function FormatarDataBrasileira(dataISO: string) {
  const data = new Date(dataISO);

  const dataFormatada = data.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  return dataFormatada.replace(',', '');
}
