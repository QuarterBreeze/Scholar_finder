import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Project, Scholar } from 'src/app/interfaces/scholar';
import { DataService } from 'src/app/services/data.service';

interface ScholarDetail {
  scholar: Scholar;
  project: Array<Project>;
  expand: boolean;
}

@Component({
  selector: 'app-scholar-result-list',
  templateUrl: './scholar-result-list.component.html',
  styleUrls: ['./scholar-result-list.component.scss'],
})
export class ScholarResultListComponent implements OnInit {
  scholarData: Array<ScholarDetail> = [];
  constructor(private http: HttpClient, private cartService: DataService) {}

  ngOnInit(): void {
    this.fetchScholar_detail();
    // console.log(this.cartService.selectedScholars);
  }

  fetchScholar_detail(): void {
    console.log(this.cartService.selectedScholars);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    this.http
      .post(
        'http://127.0.0.1:8000/api/get_scholar_detail',
        {
          selected_s_id: Array.from(this.cartService.selectedScholars),
        },
        { headers: headers }
      )
      .subscribe((data: any) => {
        console.log('FETCHED');
        this.scholarData = (data as Array<ScholarDetail>).map((sd: any) => {
          return {
            scholar: {
              s_id: sd['scholar_info']['s_id'],
              name: sd['scholar_info']['name'],
              institution: sd['scholar_info']['institution'],
              department: sd['scholar_info']['department'],
              position: sd['scholar_info']['position'],
              mail: sd['scholar_info']['mail'],
            },
            project: sd['project_info'].map((p: any) => {
              return {
                scholar_s_id: p['s_id'],
                project_name: p['project_name'],
                project_YEAR: p['PLAN_YEAR'],
                project_AMT: p['PLAN_AMT'],
              };
            }),
            expand: false,
          };
        });
      });
  }
}
