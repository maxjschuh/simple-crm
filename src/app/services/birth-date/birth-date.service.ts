import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BirthDateService {

  returnTimestampAsDateString(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de');
  }

  returnAge(timestamp: number): string {

    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If the user hasn't had their birthday yet this year, subtract one year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) age--;

    return `(Age: ${age})`;
  }

  getToday(): Date {
    return new Date();
  }
}
