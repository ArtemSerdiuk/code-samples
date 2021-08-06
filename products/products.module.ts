import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { QuicklinkModule } from 'ngx-quicklink';
import { AnalyzesListPageComponent } from './containers/analyzes-list-page/analyzes-list-page.component';
import { BackdropLoaderModule, ProductItemModule } from '@tigerq-frontend/shared';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';

const MATERIAL_COMPONENTS = [MatDialogModule, MatFormFieldModule, MatInputModule];

@NgModule({
  declarations: [AnalyzesListPageComponent],
  imports: [
    ...MATERIAL_COMPONENTS,
    CommonModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    QuicklinkModule,
    BackdropLoaderModule,
    InfiniteScrollModule,
    ProductItemModule,
  ],
})
export class ProductsModule {}
