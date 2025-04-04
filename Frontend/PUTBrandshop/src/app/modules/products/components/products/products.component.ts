import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs';
import { Category } from 'src/app/modules/core/models/categories.model';
import { PrimitiveProduct } from 'src/app/modules/core/models/product.model';
import { CategoriesService } from 'src/app/modules/core/services/categories.service';
import { ProductsService } from 'src/app/modules/core/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements AfterViewInit, OnDestroy, OnInit {
  products: PrimitiveProduct[] = [];
  categories: Category[] = [];
  totalCount = 0;

  sub = new Subscription();

  error: string | null = null;

  searchControl = new FormControl<string>('');
  sortControl = new FormControl<string>('price');
  orderControl = new FormControl<string>('asc');
  categoryControl = new FormControl<string>('');

  filteredOptions!: Observable<PrimitiveProduct[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (value) => {
        this.categories = [...value];
      },
    });
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value) => this.productService.getProducts(1, 10, value)),
      map(({ products }) => {
        return [...products];
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // this.productService.getProducts().subscribe({
    //   next: (response) => {
    //     this.products = [...response.products];
    //     this.totalCount = response.totalCount;
    //   },
    // });

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
          return this.productService.getProducts(
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
          this.totalCount = response.totalCount;
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

  sortProduct() {
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
