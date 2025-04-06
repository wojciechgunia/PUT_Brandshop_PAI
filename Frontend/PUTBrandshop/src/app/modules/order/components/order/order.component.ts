import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetOrdersResponse } from 'src/app/modules/core/models/order.model';
import { OrderService } from 'src/app/modules/core/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  orders!: GetOrdersResponse[];
  errorMsg: null | string = null;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = [...orders];
      },
      error: (err) => {
        this.errorMsg = err;
      },
    });
  }

  navigateToDetails(uuid: string) {
    this.router.navigate(['zamowienia', uuid]);
  }

  changeStatusName(name: string) {
    return this.orderService.changeStatusName(name);
  }
}
