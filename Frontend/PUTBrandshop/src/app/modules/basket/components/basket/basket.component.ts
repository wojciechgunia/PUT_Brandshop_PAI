import { BasketService } from 'src/app/modules/core/services/basket.service';
import { Component, OnInit } from '@angular/core';
import {
  BasketProduct,
  GetBasketResponse,
} from 'src/app/modules/core/models/basket.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
  basketProducts: BasketProduct[] = [];
  summaryPrice = 0;
  errorMessage: string | null = null;

  constructor(
    private basketService: BasketService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.basketService.getBasketProducts().subscribe({
      next: (response) => {
        if (response.body !== null) {
          const basketResponse = response.body as GetBasketResponse;
          this.basketProducts = [...basketResponse.basketProducts];
          this.summaryPrice = basketResponse.summaryPrice;
        }
      },
      error: (err) => {
        this.errorMessage = err;
      },
    });
  }

  deleteProduct(uuid: string) {
    this.basketProducts = this.basketProducts.filter(
      (product) => product.uuid !== uuid,
    );
  }

  navigateToCreateOrder() {
    this.router.navigate(['/zamowienia/zamow'], {
      state: { summaryPrice: this.summaryPrice },
    });
  }
}
