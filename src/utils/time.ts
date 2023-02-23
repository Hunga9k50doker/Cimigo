import { Moment } from "moment";

export const compareDateAndYear = (firstDate: Moment, secondDate: Moment) => {
  if (firstDate && secondDate && firstDate.month() === secondDate.month() && firstDate.year() === secondDate.year()) return true;
  return false;
};