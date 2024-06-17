import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

/**
 * Returns a timestamp in a german date string format.
 * @param timestamp 
 * @returns date as string in format DD/MM/YYYY
 */
  returnTimestampAsDateString(timestamp: number): string {

    const date = new Date(timestamp);
    return date.toLocaleDateString('de');
  }


/**
 * Returns the time (rounded down to full years) that has passed since the timestamp parameter.
 * @param timestamp birthdate of the person whose age should be computed
 * @returns age, i.e. time rounded down to full years
 */
  returnAge(timestamp: number): number {

    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If the contact hasn't had their birthday yet this year, subtract one year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) age--;

    return age;
  }


/**
 * Returns today's Date.
 * @returns today's Date
 */
  getToday(): Date {
    return new Date();
  }
}