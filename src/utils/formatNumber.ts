import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number: number | string) {
  return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fCurrency2(number: number | string) {
  return numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00');
}

export function fCurrency2VND(number: number | string) {
  return numeral(number).format('0,0');
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