import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs';
import { Product } from 'src/app/modules/core/models/product.model';
import { ProductsService } from 'src/app/modules/core/services/products.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { NotifierService } from 'angular-notifier';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-product-administration',
  templateUrl: './product-administration.component.html',
  styleUrls: ['./product-administration.component.scss'],
})
export class ProductAdministrationComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  displayedColumns: string[] = [
    'uuid',
    'name',
    'price',
    'category',
    'createAt',
    'actions',
  ];
  dataSource: MatTableDataSource<Product>;

  products: Product[] = [];
  totalCount = 0;

  sub = new Subscription();

  error: string | null = null;

  searchControl = new FormControl<string>('');
  sortControl = new FormControl<string>('price');
  orderControl = new FormControl<string>('asc');
  categoryControl = new FormControl<string>('');

  filteredOptions!: Observable<Product[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private notifier: NotifierService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value) => this.productService.getProductsAdmin(1, 15, value)),
      map(({ products }) => {
        return [...products];
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getProductEditUrl(name: string, createAt: string) {
    return `/admin/panel/produkty/edytor/${name}-${createAt.replaceAll(
      '-',
      ''
    )}`;
  }

  deleteProduct(uuid: string, name: string) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        name: 'Usuń produkt',
        question: 'Czy napewno chcesz usunąć produkt ' + name,
      },
      width: '300px',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.productService.deleteProduct(uuid).subscribe({
          next: () => {
            this.notifier.notify('success', 'Pomyślnie usunięto produkt');
            // this.products = this.products.filter((prod) => {
            //   return prod.uid !== uuid;
            // });
            // this.dataSource = new MatTableDataSource(this.products);
            this.ngAfterViewInit();
          },
          error: () => {
            this.notifier.notify('warning', 'Wystąpił błąd');
          },
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.route.queryParamMap
      .pipe(
        switchMap((queryMap) => {
          const pageIndex = queryMap.get('strona')
            ? Number(queryMap.get('strona'))
            : 1;
          const limit = queryMap.get('limit')
            ? Number(queryMap.get('limit'))
            : this.paginator.pageSize;
          const productName = queryMap.get('nazwa')
            ? queryMap.get('nazwa')
            : null;
          const sortProduct = queryMap.get('sortuj_po')
            ? queryMap.get('sortuj_po')
            : null;
          const orderProduct = queryMap.get('sortuj')
            ? queryMap.get('sortuj')
            : null;
          const category = queryMap.get('kategoria')
            ? queryMap.get('kategoria')
            : null;
          if (category) this.categoryControl.setValue(category);
          if (orderProduct) this.orderControl.setValue(orderProduct);
          if (sortProduct) this.sortControl.setValue(sortProduct);
          return this.productService.getProductsAdmin(
            pageIndex,
            limit,
            productName,
            sortProduct,
            orderProduct,
            category
          );
        }),
        map((response) => {
          this.products = [...response.products];
          this.dataSource = new MatTableDataSource(this.products);
          this.totalCount = response.totalCount;
          this.paginator.length = response.totalCount;
        })
      )
      .subscribe({
        error: (err) => {
          this.error = err;
        },
      });

    this.sub.add(
      this.paginator.page.subscribe({
        next: () => {
          this.navigateToSearchedParams();
        },
      })
    );
  }

  searchProduct() {
    this.paginator.pageIndex = 0;
    this.navigateToSearchedParams();
  }

  sortProduct(sort: Sort) {
    if (sort.direction) {
      this.sortControl.setValue(sort.active);
      this.orderControl.setValue(sort.direction);
    } else {
      this.sortControl.setValue('');
      this.orderControl.setValue('');
    }
    this.paginator.pageIndex = 0;
    this.navigateToSearchedParams();
  }

  navigateToSearchedParams() {
    const queryParams: { [key: string]: string | number } = {
      strona: this.paginator.pageIndex + 1,
      limit: this.paginator.pageSize,
    };

    const category = this.route.snapshot.queryParamMap.get('kategoria');
    if (this.categoryControl.value) {
      queryParams['kategoria'] = this.categoryControl.value;
    }

    if (this.searchControl.value) {
      queryParams['nazwa'] = this.searchControl.value;
    }

    if (this.sortControl.value) {
      queryParams['sortuj_po'] = this.sortControl.value;
    }

    if (this.orderControl.value) {
      queryParams['sortuj'] = this.orderControl.value;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }
}
