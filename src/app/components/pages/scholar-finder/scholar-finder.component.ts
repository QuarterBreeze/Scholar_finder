import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Dictionary } from 'src/app/interfaces/dictionary';
import { SelectItem } from 'src/app/interfaces/nz/select-item';
import { Scholar } from 'src/app/interfaces/scholar';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-scholar-finder',
  templateUrl: './scholar-finder.component.html',
  styleUrls: ['./scholar-finder.component.scss'],
})
export class ScholarFinderComponent implements OnInit {
  keywordChosen: Array<string> = [];
  keywordSuggest: Array<string> = [
    '人工智慧',
    '無人機',
    '神經網路',
    '資料探勘',
    '隨機演算法',
  ];
  scholarData: Array<Scholar> = [];
  schoolData: Array<SelectItem<string>> = [];
  selectedSchool = '';
  departmentData: Array<SelectItem<string>> = [];
  selectedDepartment = '';
  isSchoolDataFetching = true;
  currentPageScholarData: Array<Scholar> = [];
  isScholarDataFetching = true;
  isHistoryDataFetching = false;
  isScholarDataSelectAll = false;
  isScholarDataSelectPartial = false;
  isHistoryDataSelectAll = false;
  isHistoryDataSelectPartial = false;
  selectedScholarData: Set<number> = new Set<number>();
  selectedHistoryData: Set<number> = new Set<number>();
  searchHistoryList: Array<Dictionary<any>> = [
    // {
    //   checked: false,
    //   keywords: ['5G', '人工智慧'],
    //   institution: '國立成功大學',
    //   department: '工程科學系',
    //   s_ids: [1, 2, 3],
    // },
    // {
    //   checked: false,
    //   keywords: ['5G', '資料庫', '人工智慧'],
    //   institution: '國立成功大學',
    //   department: '工程科學系',
    //   s_ids: [2, 3, 6, 7, 9],
    // },
  ];
  formGroup!: FormGroup;

  constructor(
    private http: HttpClient,
    private cartService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      search: new FormControl(''),
      school: new FormControl(''),
      department: new FormControl(''),
      sex: new FormControl(''),
    });
    this.fetchScolar(true);
    this.fetchSchool();
  }

  testFetch(idx: number) {
    console.log('HISTORY to RESULT', idx);
  }

  test(): Array<number> {
    const s_ids = new Set<number>();
    this.searchHistoryList.forEach((history: any) => {
      if (history.checked) {
        history['s_ids'].forEach((s_id: number) => {
          s_ids.add(s_id);
        });
      }
    });
    console.log(s_ids);
    this.cartService.adds_ids(s_ids);
    console.log(this.cartService);
    return Array.from(s_ids);
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
    console.log(this.cartService.selectedScholars);
  }

  addToHistory(): void {
    const newHistory = {
      checked: false,
      keywords: Array.from(this.keywordChosen),
      institution: this.formGroup.get('school')?.value,
      department: this.formGroup.get('department')?.value,
      s_ids: this.scholarData.map((scholar: Scholar) => scholar.s_id),
    };
    this.searchHistoryList = [newHistory, ...this.searchHistoryList];
    this.refreshSelectedHistoryData();
  }

  onScholarSearch(): void {
    this.fetchScolar(false);
  }

  onScholarDataChecked(s_id: number, checked: boolean): void {
    this.updateSelectedScholarData(s_id, checked);
    this.refreshSelectedScholarData();
  }

  onScholarDataCheckedAll(checked: boolean): void {
    this.currentPageScholarData.forEach(({ s_id }) => {
      this.updateSelectedScholarData(s_id, checked);
    });
    this.refreshSelectedScholarData();
  }

  onHistoryDataChecked(index: number, checked: boolean): void {
    this.updateSelectedHistoryData(index, checked);
    this.refreshSelectedHistoryData();
  }

  onHistoryDataCheckedAll(checked: boolean): void {
    this.searchHistoryList.forEach((_history: any, index: number) => {
      this.updateSelectedHistoryData(index, checked);
    });
    this.refreshSelectedHistoryData();
  }

  updateSelectedHistoryData(index: number, checked: boolean): void {
    this.searchHistoryList[index]['checked'] = checked;
  }

  onRedirectToResult(): void {
    this.test();
    this.router.navigate(['/result']);
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
    this.isScholarDataSelectAll = selectedData.every(({ s_id }) => {
      this.selectedScholarData.has(s_id);
    });
    this.isScholarDataSelectPartial =
      !this.isScholarDataSelectAll &&
      selectedData.some(({ s_id }) => {
        this.selectedScholarData.has(s_id);
      });
  }

  refreshSelectedHistoryData(): void {
    const selectedHistory = Array.from(this.searchHistoryList);
    this.isHistoryDataSelectAll = selectedHistory.every((history: any) => {
      return history['checked'];
    });
    this.isHistoryDataSelectPartial =
      !this.isHistoryDataSelectAll &&
      selectedHistory.some((history: any) => {
        return history['checked'];
      });
  }

  fetchScolar(isInit: boolean = false): void {
    this.isScholarDataFetching = true;
    this.http
      .post('http://127.0.0.1:8000/api/get_scholar', {
        keywords: this.keywordChosen,
        school: [this.formGroup.get('school')?.value] || [],
        department: [this.formGroup.get('department')?.value] || [],
        sex: [this.formGroup.get('sex')?.value] || [],
      })
      .subscribe((data: any) => {
        console.log('FETCHED');
        console.log(data['scholars']);
        this.scholarData = (data['scholars'] as Array<Scholar>).map(
          (s: any) => {
            return {
              s_id: s['scholar_s_id'],
              name: s['scholar_name'],
              project_count: s['scholar_project_count'],
              institution: s['scholar_institution'],
              department: s['scholar_department'],
              position: s['scholar_position'],
              mail: s['scholar_email'],
              phone: s['scholar_phone'],
            };
          }
        );
        if (!isInit) {
          this.addToHistory();
        }
        this.isScholarDataFetching = false;
        // this.addtohistory(this.scholarData.s_id);
      });
  }
  fetchSchool(): void {
    this.isSchoolDataFetching = true;
    this.http
      .get('http://127.0.0.1:8000/api/get_school_data')
      .subscribe((data: any) => {
        console.log('FETCHED');
        console.log(data['institution']);
        console.log(data['department']);
        this.schoolData = (data['institution'] as Array<string>).map(
          (item: string) => {
            return { label: item, value: item };
          }
        );
        this.departmentData = (data['department'] as Array<string>).map(
          (item: string) => {
            return { label: item, value: item };
          }
        );
        this.isSchoolDataFetching = false;
      });
  }
}
