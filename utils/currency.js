const numberFormatter = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  minimumFractionDigits: 0
});

export function currencify(ammount) {
  return numberFormatter.format(ammount);
}
