import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {


  returnTimestampAsDateString(timestamp: number): string {

    const date = new Date(timestamp);
    return date.toLocaleDateString('de');
  }


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


  getToday(): Date {
    return new Date();
  }
}
