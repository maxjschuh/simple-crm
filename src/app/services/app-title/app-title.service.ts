import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppTitleService {

  titleDistributor = new BehaviorSubject<string>('');
}
