function truncate(value: number, precision: number) {
  const s = value.toFixed(precision + 4);
  const i = s.indexOf('.');
  if (i === -1) {
    return value;
  } else {
    const sx = s.substring(0, i + precision + 1);
    return Number(sx);
  }
}

export function fiatAmount(value: number) {
  return truncate(value, 2);
}

export function cryptoAmount(value: number, precision=8) {
  return truncate(value, precision);
}

export function coinAmount(value: number, coin: string, precision=8) {
  if (value || value === 0) {
    return ['BRL', 'USDT'].includes(coin) ? fiatAmount(value) : cryptoAmount(value, precision);
  } else {
    return value;
  }
}

export function coinPrice(value: number, coin: string) {
  return coin === 'USDT' ? truncate(value, 4) : truncate(value, 2);
}
