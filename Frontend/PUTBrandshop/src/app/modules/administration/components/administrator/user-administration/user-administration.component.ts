import { AuthService } from 'src/app/modules/core/services/auth.service';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserAdminis } from 'src/app/modules/core/models/auth.model';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
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
import { DialogChangeRoleComponent } from './dialog-change-role/dialog-change-role.component';

@Component({
  selector: 'app-user-administration',
  templateUrl: './user-administration.component.html',
  styleUrls: ['./user-administration.component.scss'],
})
export class UserAdministrationComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  displayedColumns: string[] = [
    'uuid',
    'login',
    'email',
    'role',
    'is-active',
    'actions',
  ];
  dataSource: MatTableDataSource<UserAdminis>;

  users: UserAdminis[] = [];
  totalCount = 0;

  sub = new Subscription();

  error: string | null = null;

  searchControl = new FormControl<string>('');
  sortControl = new FormControl<string>('login');
  orderControl = new FormControl<string>('asc');
  categoryControl = new FormControl<string>('');

  filteredOptions!: Observable<UserAdminis[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
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
      switchMap((value) => this.authService.getUsersAdmin(1, 15, value)),
      map(({ users }) => {
        return [...users];
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getSymbol(isLock: boolean, isEnabled: boolean) {
    if (!isLock && isEnabled) {
      return 'check';
    } else {
      return 'close';
    }
  }
  unlockUser(uuid: string, name: string) {
    this.authService.unlockUser(uuid, name).subscribe({
      next: () => {
        this.notifier.notify('success', 'Pomyślnie odblokowano użytkownika');
        this.users.find((value) => {
          if (value.login == name && value.uuid == uuid) {
            value.islock = !value.islock;
          }
        });
        this.dataSource = new MatTableDataSource(this.users);
      },
      error: () => {
        this.notifier.notify('warning', 'Wystąpił błąd');
      },
    });
  }

  lockUser(uuid: string, name: string) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        name: 'Zablokuj użytkownika',
        question: 'Czy napewno chcesz zablokować użytkownica: ' + name,
      },
      width: '300px',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.authService.lockUser(uuid, name).subscribe({
          next: () => {
            this.notifier.notify(
              'success',
              'Pomyślnie zablokowano użytkownika'
            );
            this.users.find((value) => {
              if (value.login == name && value.uuid == uuid) {
                value.islock = !value.islock;
              }
            });
            this.dataSource = new MatTableDataSource(this.users);
          },
          error: () => {
            this.notifier.notify('warning', 'Wystąpił błąd');
          },
        });
      }
    });
  }

  changeRole(uuid: string, name: string, role: string) {
    const dialogRef = this.dialog.open(DialogChangeRoleComponent, {
      data: {
        role: role,
      },
      width: '350px',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.authService.changeRole(uuid, name, result).subscribe({
          next: () => {
            this.notifier.notify('success', 'Pomyślnie zmieniono uprawnienia');
            this.users.find((value) => {
              if (value.login == name && value.uuid == uuid) {
                value.role = result;
              }
            });
            this.dataSource = new MatTableDataSource(this.users);
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
          const userName = queryMap.get('nazwa') ? queryMap.get('nazwa') : null;
          const sortUsers = queryMap.get('sortuj_po')
            ? queryMap.get('sortuj_po')
            : null;
          const orderUsers = queryMap.get('sortuj')
            ? queryMap.get('sortuj')
            : null;
          if (orderUsers) this.orderControl.setValue(orderUsers);
          if (sortUsers) this.sortControl.setValue(sortUsers);
          return this.authService.getUsersAdmin(
            pageIndex,
            limit,
            userName,
            sortUsers,
            orderUsers
          );
        }),
        map((response) => {
          this.users = [...response.users];
          this.dataSource = new MatTableDataSource(this.users);
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

  searchUser() {
    this.paginator.pageIndex = 0;
    this.navigateToSearchedParams();
  }

  sortUser(sort: Sort) {
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
