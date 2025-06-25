export function FormatarData(dataHora: string) {
  const data = new Date(dataHora);

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const hora = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');

  return `${dia}/${mes} ${hora}:${minutos}`;
}

export function ConverterDataBrasil(dataString: string) {
  const data = dataString.split('-');

  return `${data[2]}/${data[1]}/${data[0]}`;
}

export function ConverterDataBrasilSemAno(dataString: string) {
  const data = dataString.split('-');

  return `${data[2]}/${data[1]}`;
}

export function FormatarDataHora(dataHoraStr: string) {
  const [data, hora] = dataHoraStr.split(' ')
  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano} ${hora}`
}

export function FormatarDataBrasileira(dataISO: any) {
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
