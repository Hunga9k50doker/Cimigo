import { replace } from 'lodash';
import { currencySymbol, ECurrency } from 'models/general';
import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number: number | string) {
  return `${currencySymbol[ECurrency.USD].first}${numeral(number || 0).format(Number.isInteger(number || 0) ? '0,0' : '0,0.00')}${currencySymbol[ECurrency.USD].last}`
}

export function fCurrency2(number?: number | string) {
  return numeral(number || 0).format(Number.isInteger(number || 0) ? '0,0' : '0,0.00');
}

export function fCurrencyVND(number?: number | string) {
  return `${currencySymbol[ECurrency.VND].first}${numeral(number || 0).format('0,0')}${currencySymbol[ECurrency.VND].last}`
}

export function fCurrency2VND(number?: number | string) {
  return numeral(number || 0).format('0,0');
}

export function fPercent(number: number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number: number | string) {
  return numeral(number).format();
}

export function fShortenNumber(number: number | string) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number: number | string) {
  return numeral(number).format('0.0 b');
}

export function round(number: number) {
  return Math.round(number * 100) / 100
}
const ordinals: string[] = ['th', 'st', 'nd', 'rd'];
export const formatOrdinalumbers = (n: number, language?: string) => {
  let v = n % 100;
  return (language === 'en' ? n + (ordinals[(v - 20) % 10]||ordinals[v]||ordinals[0]) : n);
}