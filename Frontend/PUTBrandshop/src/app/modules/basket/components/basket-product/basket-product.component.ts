import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { BasketProduct } from 'src/app/modules/core/models/basket.model';
import { BasketService } from 'src/app/modules/core/services/basket.service';

@Component({
  selector: 'app-basket-product',
  templateUrl: './basket-product.component.html',
  styleUrls: ['./basket-product.component.scss'],
})
export class BasketProductComponent {
  @Input() basketProduct!: BasketProduct;
  @Output() deleteProductUuid = new EventEmitter<string>();

  constructor(
    private basketService: BasketService,
    private notifierService: NotifierService,
  ) {}

  deleteProductFromBasket() {
    this.basketService
      .deleteProductToBasket(this.basketProduct.uuid)
      .subscribe({
        next: () => {
          this.notifierService.notify('success', 'Usunięto produkt z koszyka');
          this.deleteProductUuid.emit(this.basketProduct.uuid);
        },
        error: () => {
          this.notifierService.notify(
            'warning',
            'Nie udało się usunąć produktu',
          );
        },
      });
  }
}
