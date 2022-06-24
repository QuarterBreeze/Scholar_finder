import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Scholar } from 'src/app/interfaces/scholar';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-scholar-finder',
  templateUrl: './scholar-finder.component.html',
  styleUrls: ['./scholar-finder.component.scss'],
})
export class ScholarFinderComponent implements OnInit {
  keywordChosen: Array<string> = [];
  keywordSuggest: Array<string> = ['te', 'tes'];
  scholarData: Array<Scholar> = [];
  currentPageScholarData: Array<Scholar> = [];
  isScholarDataFetching = true;
  isHistoryDataFetching = false;
  isScholarDataSelectAll = false;
  isScholarDataSelectPartial = false;
  selectedScholarData: Set<number> = new Set<number>();
  searchHistoryList: Array<Array<string>> = [
    ['a', 'b', 'c'],
    ['1', 'w'],
    ['?'],
  ];
  formGroup!: FormGroup;

  constructor(private http: HttpClient, private cartService: CartService) {}

  ngOnInit(): void {
    this.fetchScolar([]);
    this.formGroup = new FormGroup({
      search: new FormControl(''),
    });
  }

  onScholarTablePageChange(pageData: Readonly<Array<Scholar>>) {
    this.currentPageScholarData = Array.from(pageData);
    this.refreshSelectedScholarData();
  }

  onAddKeyword(): void {
    const keyword = (this.formGroup.get('search')?.value as string).trim();
    if (keyword.length === 0) {
      return;
    }
    if (this.keywordChosen.includes(keyword)) {
      this.formGroup.get('search')?.setValue('');
      return;
    }
    this.keywordChosen.push(keyword);
    this.formGroup.get('search')?.setValue('');
  }

  onRemoveKeyword(keyword: string): void {
    this.keywordChosen = this.keywordChosen.filter((word) => {
      return word != keyword;
    });
  }

  onAddToCart(): void {
    this.cartService.addScholars(this.selectedScholarData);
  }

  onScholarSearch(): void {
    this.fetchScolar(this.keywordChosen);
  }

  onScholarDataChecked(s_id: number, checked: boolean): void {
    this.updateSelectedScholarData(s_id, checked);
    this.refreshSelectedScholarData();
  }

  onScholarDataCheckedAll(checked: boolean): void {
    this.currentPageScholarData.forEach(({ scholar_s_id }) => {
      this.updateSelectedScholarData(scholar_s_id, checked);
    });
    this.refreshSelectedScholarData();
  }

  updateSelectedScholarData(s_id: number, checked: boolean): void {
    if (checked) {
      this.selectedScholarData.add(s_id);
    } else {
      this.selectedScholarData.delete(s_id);
    }
  }

  refreshSelectedScholarData(): void {
    const selectedData = Array.from(this.currentPageScholarData);
    this.isScholarDataSelectAll = selectedData.every(({ scholar_s_id }) => {
      this.selectedScholarData.has(scholar_s_id);
    });
    this.isScholarDataSelectPartial =
      !this.isScholarDataSelectAll &&
      selectedData.some(({ scholar_s_id }) => {
        this.selectedScholarData.has(scholar_s_id);
      });
  }

  fetchScolar(keywords: Array<string>): void {
    this.isScholarDataFetching = true;
    this.http
      .post('http://127.0.0.1:8000/api/get_scholar', {
        keywords: keywords,
      })
      .subscribe((data: any) => {
        console.log('FETCHED');
        console.log(data['scholars']);
        this.scholarData = data['scholars'];
        this.isScholarDataFetching = false;
      });
  }
}
