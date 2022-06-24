import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Scholar } from 'src/app/interfaces/scholar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  scholars_list: MatTableDataSource<Scholar> = new MatTableDataSource<Scholar>(
    []
  );
  keyword = '';
  displayedColumns = ['scholar_name', 'scholar_project_count', 'scholar_s_id'];
  formGroup!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchScolar('');
    this.formGroup = new FormGroup({
      keyword: new FormControl(''),
    });
  }

  ngAfterViewInit(): void {}

  fetchScolar(keyword: string): void {
    this.http
      .post('http://127.0.0.1:8000/api/get_scholar',{
        keyword: keyword
      })
      .subscribe((data: any) => {
        console.log("FETCHED");
        console.log(data['scholars']);
        this.scholars_list.data = data['scholars'];
        this.scholars_list.paginator = this.paginator;
      });
  }

  onSearch() :void{
    this.fetchScolar(this.formGroup.get('keyword')?.value);
  }
}
