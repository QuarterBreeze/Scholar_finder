import { Injectable } from '@angular/core';
import { Scholar } from '../interfaces/scholar';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  selectedScholars: Set<number>;

  constructor() {
    this.selectedScholars = new Set<number>();
  }

  addScholars(scholars: Set<number>): void {
    scholars.forEach(scholar=>{
      this.selectedScholars.add(scholar);
    })
  }
}
