import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription, switchMap, map } from 'rxjs';
import { GetOrderResponse } from 'src/app/modules/core/models/order.model';
import { OrderService } from 'src/app/modules/core/services/order.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DialogSetStatusComponent } from './dialog-set-status/dialog-set-status.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class OrderListComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'orders',
    'client',
    'status',
    'payment.name',
    'deliver.name',
  ];
  displayedColumnsExpanded: string[] = this.displayedColumns.concat(['expand']);
  dataSource: MatTableDataSource<GetOrderResponse>;
  expandedElement!: GetOrderResponse | null;

  orders: GetOrderResponse[] = [];
  totalCount = 0;

  sub = new Subscription();

  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private notifier: NotifierService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  changeStatus(uuid: string, status: string) {
    const dialogRef = this.dialog.open(DialogSetStatusComponent, {
      data: {
        status: status,
      },
      width: '350px',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        console.log(result);
        this.orderService.changeStatus(uuid, result).subscribe({
          next: () => {
            this.notifier.notify('success', 'Pomyślnie zmieniono status');
            this.orders.find((value) => {
              if (value.uuid === uuid) {
                value.status = result;
              }
            });
            this.dataSource = new MatTableDataSource(this.orders);
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

          return this.orderService.getOrdersAdmin(pageIndex, limit);
        }),
        map((response) => {
          this.orders = [...response.orders];
          this.dataSource = new MatTableDataSource(this.orders);
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

  navigateToSearchedParams() {
    const queryParams: { [key: string]: string | number } = {
      strona: this.paginator.pageIndex + 1,
      limit: this.paginator.pageSize,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  changeStatusName(name: string) {
    return this.orderService.changeStatusName(name);
  }
}
