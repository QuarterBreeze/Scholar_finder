import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TestComponent } from './components/test/test.component';
import { TableComponent } from './components/table/table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from "@angular/forms";
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ScholarFinderComponent } from './components/pages/scholar-finder/scholar-finder.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { JoinPipe } from './pipes/join.pipe';
import { IconDefinition } from '@ant-design/icons-angular';

import { PlusOutline } from '@ant-design/icons-angular/icons';
const icons: IconDefinition[] = [ PlusOutline ];

@NgModule({
  declarations: [AppComponent, TestComponent, TableComponent, ScholarFinderComponent, JoinPipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzIconModule.forRoot(icons),
    NzButtonModule,
    NzFormModule,
    NzTagModule,
    NzLayoutModule,
    NzTableModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
