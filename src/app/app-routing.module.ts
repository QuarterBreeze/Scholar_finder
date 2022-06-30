import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScholarFinderComponent } from './components/pages/scholar-finder/scholar-finder.component';
import { ScholarResultListComponent } from './components/pages/scholar-result-list/scholar-result-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/finder', pathMatch: 'full' },
  { path: 'finder', component: ScholarFinderComponent },
  { path: 'result', component: ScholarResultListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
