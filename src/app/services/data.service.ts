import { Injectable } from '@angular/core';
import { StarTwoTone } from '@ant-design/icons-angular/icons';
import { Scholar } from '../interfaces/scholar';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  selectedScholars: Set<number>;

  constructor() {
    this.selectedScholars = new Set<number>();
  }
  adds_ids(s_ids: Set<number>): void {
    s_ids.forEach((s_id) => {
      this.selectedScholars.add(s_id);
    });
  }
  addScholars(scholars: Set<number>): void {
    scholars.forEach((scholar) => {
      this.selectedScholars.add(scholar);
    });
  }
}
