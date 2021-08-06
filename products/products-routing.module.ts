import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyzesListPageComponent } from './containers/analyzes-list-page/analyzes-list-page.component';

const routes: Routes = [
  { path: '', component: AnalyzesListPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
