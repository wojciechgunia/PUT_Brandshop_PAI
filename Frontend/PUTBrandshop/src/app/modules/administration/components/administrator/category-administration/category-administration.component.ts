import { CategoriesService } from 'src/app/modules/core/services/categories.service';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Category } from 'src/app/modules/core/models/categories.model';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import {
  Subscription,
  Observable,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
} from 'rxjs';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { DialogCategoryAddComponent } from './dialog-category-add/dialog-category-add.component';

@Component({
  selector: 'app-category-administration',
  templateUrl: './category-administration.component.html',
  styleUrls: ['./category-administration.component.scss'],
})
export class CategoryAdministrationComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  displayedColumns: string[] = ['uuid', 'name', 'actions'];
  dataSource: MatTableDataSource<Category>;

  categories: Category[] = [];
  totalCount = 0;

  sub = new Subscription();

  error: string | null = null;

  searchControl = new FormControl<string>('');

  filteredOptions!: Observable<Category[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private categoryService: CategoriesService,
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
      switchMap((value) =>
        this.categoryService.getCategoriesAdmin(1, 5, value)
      ),
      map(({ categories }) => {
        return [...categories];
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  deleteCategory(uuid: string, name: string) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        name: 'Usuń kategorie',
        question: 'Czy napewno chcesz usunąć kategorie ' + name,
      },
      width: '300px',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.categoryService.deleteCategory(uuid).subscribe({
          next: () => {
            this.notifier.notify('success', 'Pomyślnie usunięto kategorie');
            // this.categories = this.categories.filter((prod) => {
            //   return prod.shortId !== uuid;
            // });
            // this.dataSource = new MatTableDataSource(this.categories);
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
          return this.categoryService.getCategoriesAdmin(
            pageIndex,
            limit,
            productName
          );
        }),
        map((response) => {
          this.categories = [...response.categories];
          this.dataSource = new MatTableDataSource(this.categories);
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

  searchCategory() {
    this.paginator.pageIndex = 0;
    this.navigateToSearchedParams();
  }

  navigateToSearchedParams() {
    const queryParams: { [key: string]: string | number } = {
      strona: this.paginator.pageIndex + 1,
      limit: this.paginator.pageSize,
    };

    if (this.searchControl.value) {
      queryParams['nazwa'] = this.searchControl.value;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  addCategory() {
    const dialogRef = this.dialog.open(DialogCategoryAddComponent, {
      width: '400px',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.categoryService.addCategory({ name: result }).subscribe({
          next: () => {
            this.notifier.notify('success', 'Pomyślnie dodano kategorię');
            this.ngAfterViewInit();
          },
          error: () => {
            this.notifier.notify('warning', 'Wystąpił błąd');
          },
        });
      }
    });
  }
}
