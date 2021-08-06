import { AnalyzesListPageComponent } from './analyzes-list-page.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsRoutingModule } from '../../products-routing.module';
import { QuicklinkModule } from 'ngx-quicklink';
import { BackdropLoaderModule, CommonSnackbarModule, ProductItemModule } from '@tigerq-frontend/shared';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CurrentUserService } from '@tigerq-frontend/portal/core/services/current-user.service';
import { CurrentUserServiceMock } from '@tigerq-frontend/portal/core/testing/current-user-service.mock';
import { ProductsServiceMock } from '@tigerq-frontend/portal/core/testing/products.service.mock';
import { ProductsService } from '@tigerq-frontend/portal/core/services/products.service';
import { ServicesListPageComponent } from '../services-list-page/services-list-page.component';
import { ApiDataSourceMock, InfiniteScrollServiceMock } from '@tigerq-frontend/core/mocks';
import { InfiniteScrollService } from '@tigerq-frontend/core/services';
import { HttpClient } from '@angular/common/http';

/* eslint-disable @typescript-eslint/unbound-method */
describe('AnalyzesListPageComponent', () => {
  let component: AnalyzesListPageComponent;
  let fixture: ComponentFixture<AnalyzesListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule,
        ReactiveFormsModule,
        ProductsRoutingModule,
        QuicklinkModule,
        BackdropLoaderModule,
        InfiniteScrollModule,
        ProductItemModule,
        CommonSnackbarModule,
      ],
      declarations: [AnalyzesListPageComponent, ServicesListPageComponent],
      providers: [
        {
          provide: CurrentUserService,
          useClass: CurrentUserServiceMock,
        },
        {
          provide: ProductsService,
          useClass: ProductsServiceMock,
        },
        {
          provide: InfiniteScrollService,
          useClass: InfiniteScrollServiceMock,
        },
        {
          provide: HttpClient,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzesListPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      jest.spyOn(component, '_initDataSource').mockImplementation(() => null);
    });

    it('should call _initDataSource()', () => {
      expect(component._initDataSource).not.toHaveBeenCalled();
      component.ngOnInit();
      expect(component._initDataSource).toHaveBeenCalled();
    });
  });

  describe('_initDataSource()', () => {
    it('should define dataSource variable', () => {
      expect(component.dataSource).toBeUndefined();
      component._initDataSource();
      expect(component.dataSource).toBeDefined();
    });
  });

  describe('trackByFn()', () => {
    it('should return id number', () => {
      const mockId: number = 9999;
      expect(component.trackByFn(1, { id: mockId } as any)).toBe(mockId);
    });
  });

  describe('onScrollDown()', () => {
    it('should call dataSource.nextPage()', () => {
      component.dataSource = new ApiDataSourceMock() as any;
      const spy = jest.spyOn(component.dataSource, 'nextPage');
      component.onScrollDown();
      expect(spy).toHaveBeenCalled();
    });
  });
});
